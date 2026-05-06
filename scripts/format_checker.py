#!/usr/bin/env python3
"""
晨报格式检查器 - 确保每日晨报符合4月13日标准模板

用法:
    python3 morning_news_format_checker.py /path/to/YYYY-MM-DD.html
    python3 morning_news_format_checker.py --batch /path/to/openclaw-morning-news/
"""

import sys
import os
import re
import glob
import argparse
from datetime import datetime

# 4月23日标准格式基准特征（确立于2026-04-16）
STANDARD_FEATURES = {
    "style_markers": {
        "standard-light": {
            "description": "4.23标准浅色风格 (Inter字体, hero-section类名)",
            "required": ["hero-section", "Inter", "#f5f5f7"],
            "css_class": "hero-section"
        },
        "modern-grid": {
            "description": "Modern grid风格 (hero类, card-grid, CSS变量)",
            "required": [":root", "--primary", "card-grid", "hero"],
            "css_class": "card-grid"
        },
        "dark-tech": {
            "description": "深色科技风 (--dark, 紫色渐变)",
            "required": ["--dark", "--gradient-hero", "#0f0f1a"],
            "css_class": "--dark"
        },
        "serif-sidebar": {
            "description": "衬线字体+侧边栏 (Noto Serif SC, sidebar)",
            "required": ["Noto Serif SC", "sidebar", "section-line"],
            "css_class": "Noto Serif SC"
        }
    }
}

# 14个标准板块
REQUIRED_SECTIONS = [
    "今日洞察", "务实落地建议", "AI DevOps", "头部AI公司", "具身智能",
    "云原生", "项目管理", "全球动态", "大咖声音", "名字解释",
    "关键数据速览", "深度分析", "行业热力图", "权威来源"
]

# 关键格式元素检查
REQUIRED_ELEMENTS = {
    "hero_section": {"name": "英雄区", "patterns": [r'hero[- ]?section', r'class="hero"']},
    "content_grid": {"name": "两栏布局", "patterns": [r'content-grid', r'card-grid']},
    "recommendations": {"name": "务实建议", "patterns": [r'务实落地建议']},
    "voices": {"name": "大咖声音", "patterns": [r'大咖声音']},
    "terms": {"name": "名字解释", "patterns": [r'名字解释']},
    "data": {"name": "关键数据", "patterns": [r'关键数据速览']},
    "sources": {"name": "权威来源", "patterns": [r'权威来源']},
    "priority_tags": {"name": "优先级标签", "patterns": [r'tag-p[0-2]', r'priority-tag']},
    "news_meta": {"name": "新闻元信息", "patterns": [r'news-meta', r'news-header']}
}


def detect_style(content):
    """检测HTML的风格类型"""
    if "Noto Serif SC" in content and "sidebar" in content:
        return "serif-sidebar", "❌ 偏离标准 (Noto Serif SC + sidebar)"
    if "--dark" in content and "#0f0f1a" in content:
        return "dark-tech", "❌ 偏离标准 (深色科技风)"
    if ":root" in content and "card-grid" in content and "hero" in content:
        # 进一步区分modern-grid和standard-light
        if "hero-section" in content:
            return "standard-light", "✅ 标准格式"
        return "modern-grid", "⚠️ 非标准风格 (modern-grid)"
    if "hero-section" in content and "Inter" in content:
        return "standard-light", "✅ 标准格式"
    return "unknown", "❓ 无法识别风格"


def check_sections(content):
    """检查14个标准板块是否齐全"""
    found = []
    missing = []
    for sec in REQUIRED_SECTIONS:
        if sec in content:
            found.append(sec)
        else:
            missing.append(sec)
    return found, missing


def check_elements(content):
    """检查关键格式元素"""
    results = {}
    for key, config in REQUIRED_ELEMENTS.items():
        found = False
        for pattern in config["patterns"]:
            if re.search(pattern, content, re.I):
                found = True
                break
        results[key] = found
    return results


def check_file(filepath):
    """检查单个晨报文件"""
    if not os.path.exists(filepath):
        return {"error": f"文件不存在: {filepath}"}
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {"error": f"读取失败: {e}"}
    
    basename = os.path.basename(filepath)
    
    # 风格检测
    style, style_status = detect_style(content)
    
    # 板块检查
    found_sections, missing_sections = check_sections(content)
    
    # 元素检查
    elements = check_elements(content)
    
    # 综合评分
    section_score = len(found_sections)
    element_score = sum(elements.values())
    total_elements = len(elements)
    
    # 判断合格性
    is_pass = (
        style == "standard-light" and
        section_score >= 13 and
        elements["hero_section"] and
        elements["content_grid"] and
        elements["voices"] and
        elements["terms"] and
        elements["sources"]
    )
    
    return {
        "file": basename,
        "style": style,
        "style_status": style_status,
        "sections_found": section_score,
        "sections_total": len(REQUIRED_SECTIONS),
        "missing_sections": missing_sections,
        "elements": elements,
        "element_score": f"{element_score}/{total_elements}",
        "pass": is_pass
    }


def print_report(result):
    """打印单个文件的检查报告"""
    if "error" in result:
        print(f"❌ {result['error']}")
        return
    
    status = "✅ 通过" if result["pass"] else "❌ 未通过"
    print(f"\n{'='*80}")
    print(f"📄 {result['file']}  {status}")
    print(f"{'='*80}")
    print(f"风格: {result['style_status']}")
    print(f"板块: {result['sections_found']}/{result['sections_total']}")
    if result["missing_sections"]:
        print(f"缺失板块: {', '.join(result['missing_sections'])}")
    print(f"格式元素: {result['element_score']}")
    
    element_details = []
    for key, found in result["elements"].items():
        name = REQUIRED_ELEMENTS[key]["name"]
        icon = "✅" if found else "❌"
        element_details.append(f"{icon} {name}")
    print(f"  {' | '.join(element_details)}")


def batch_check(directory):
    """批量检查目录下所有晨报文件"""
    pattern = os.path.join(directory, "2026-*.html")
    files = sorted(glob.glob(pattern))
    
    if not files:
        print(f"未找到晨报文件: {pattern}")
        return
    
    print(f"\n🔍 批量检查 {len(files)} 个晨报文件")
    print(f"标准模板: 4月23日浅色风格 (standard-light)")
    print(f"检查基准: 14个板块 + 8个关键格式元素")
    print("="*100)
    
    # 汇总表头
    print(f"{'File':<20} {'Style':<35} {'Sections':<10} {'Hero':<6} {'Grid':<6} {'Voices':<8} {'Terms':<7} {'Sources':<8} {'Status':<10}")
    print("="*100)
    
    passed = 0
    failed = 0
    
    for filepath in files:
        result = check_file(filepath)
        if "error" in result:
            continue
        
        status = "✅ PASS" if result["pass"] else "❌ FAIL"
        if result["pass"]:
            passed += 1
        else:
            failed += 1
        
        print(f"{result['file']:<20} {result['style_status']:<35} {result['sections_found']}/{result['sections_total']:<6} "
              f"{'✅' if result['elements']['hero_section'] else '❌':<6} "
              f"{'✅' if result['elements']['content_grid'] else '❌':<6} "
              f"{'✅' if result['elements']['voices'] else '❌':<8} "
              f"{'✅' if result['elements']['terms'] else '❌':<7} "
              f"{'✅' if result['elements']['sources'] else '❌':<8} "
              f"{status}")
        
        if result["missing_sections"]:
            print(f"  Missing: {', '.join(result['missing_sections'])}")
    
    print("="*100)
    print(f"汇总: ✅ 通过 {passed} 个 | ❌ 未通过 {failed} 个 | 总计 {passed+failed} 个")
    print(f"\n💡 使用标准格式: {sum(1 for f in files if check_file(f).get('style') == 'standard-light')} 个")
    print()


def main():
    parser = argparse.ArgumentParser(description="晨报格式检查器")
    parser.add_argument("path", nargs="?", help="单个HTML文件或目录路径")
    parser.add_argument("--batch", action="store_true", help="批量检查目录下所有文件")
    parser.add_argument("--standard", action="store_true", help="显示标准格式定义")
    
    args = parser.parse_args()
    
    if args.standard:
        print("📋 晨报标准格式定义 (4月23日基准版)")
        print("="*60)
        print("风格要求:")
        print("  - 浅色主题 (#f5f5f7背景)")
        print("  - Inter字体")
        print("  - hero-section CSS类")
        print("  - content-grid 两栏布局")
        print("\n14个标准板块:")
        for i, sec in enumerate(REQUIRED_SECTIONS, 1):
            print(f"  {i:2d}. {sec}")
        print("\n8个关键格式元素:")
        for key, config in REQUIRED_ELEMENTS.items():
            print(f"  - {config['name']}")
        return
    
    if not args.path:
        # 默认检查 workspace/openclaw-morning-news/
        default_dir = "/root/.openclaw/workspace/openclaw-morning-news"
        if os.path.isdir(default_dir):
            batch_check(default_dir)
        else:
            print(f"默认目录不存在: {default_dir}")
            parser.print_help()
        return
    
    if os.path.isdir(args.path) or args.batch:
        batch_check(args.path)
    elif os.path.isfile(args.path):
        result = check_file(args.path)
        print_report(result)
    else:
        print(f"路径不存在: {args.path}")


if __name__ == "__main__":
    main()
