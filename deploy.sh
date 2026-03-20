#!/bin/bash

# 部署脚本 - 推送到GitHub Pages

set -e

echo "🚀 开始部署晨报网站到GitHub Pages..."

# 获取当前日期
DATE=$(date +"%Y年%m月%d日")

echo "📅 当前日期: $DATE"
echo ""

# 检查是否有变更
if git diff --quiet && git diff --staged --quiet; then
    echo "⚠️ 没有检测到变更"
    exit 0
fi

# 添加所有变更
echo "📦 添加变更到git..."
git add index.html

# 提交变更
echo "💾 提交变更..."
git commit -m "更新晨报: $DATE"

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push origin main

echo ""
echo "✅ 部署成功！"
echo "🌐 网站地址: https://vivianking6855.github.io/openclaw-morning-news/"
echo ""