/**
 * 豆饼晨报生成器 - 模板引擎
 * 将用户输入的数据渲染为标准格式的晨报HTML
 */

const MorningNewsTemplate = {
  // 完整CSS样式系统
  styles: `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f7; color: #1d1d1f; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .hero { background: linear-gradient(135deg, #1d1d1f 0%, #434344 100%); color: white; border-radius: 20px; padding: 40px; margin-bottom: 30px; position: relative; overflow: hidden; }
    .hero::before { content: '❤️‍🔥'; position: absolute; top: 20px; right: 30px; font-size: 48px; opacity: 0.3; }
    .hero-badge { display: inline-block; background: rgba(255,255,255,0.15); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; backdrop-filter: blur(10px); }
    .hero h1 { font-size: 36px; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
    .hero-summary { font-size: 16px; opacity: 0.9; max-width: 800px; margin-bottom: 20px; }
    .hero-meta { display: flex; gap: 20px; font-size: 13px; opacity: 0.7; flex-wrap: wrap; }
    .hero-meta span { display: flex; align-items: center; gap: 6px; }
    .section { background: white; border-radius: 16px; padding: 30px; margin-bottom: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .section-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .section-title .icon { font-size: 24px; }
    .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .card { background: #fbfbfd; border-radius: 12px; padding: 20px; border: 1px solid #e8e8ed; transition: transform 0.2s, box-shadow 0.2s; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .card h3 { font-size: 15px; font-weight: 600; margin-bottom: 10px; color: #1d1d1f; }
    .card p { font-size: 13px; color: #86868b; line-height: 1.6; }
    .card .tag { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-top: 10px; }
    .tag-p0 { background: #ffebee; color: #c62828; }
    .tag-p1 { background: #fff3e0; color: #ef6c00; }
    .tag-p2 { background: #e8f5e9; color: #2e7d32; }
    .news-item { padding: 16px 0; border-bottom: 1px solid #f0f0f0; }
    .news-item:last-child { border-bottom: none; }
    .news-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
    .news-title { font-weight: 600; font-size: 15px; color: #1d1d1f; }
    .news-source { font-size: 12px; color: #86868b; }
    .news-desc { font-size: 13px; color: #515154; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f5f5f7; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e8e8ed; }
    td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
    tr:hover { background: #fbfbfd; }
    .quote-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .quote-card { background: linear-gradient(135deg, #fafafa 0%, #f5f5f7 100%); border-radius: 12px; padding: 24px; border-left: 4px solid #0071e3; }
    .quote-text { font-size: 15px; font-style: italic; color: #1d1d1f; margin-bottom: 12px; line-height: 1.6; }
    .quote-author { font-size: 13px; font-weight: 600; color: #0071e3; }
    .quote-title { font-size: 12px; color: #86868b; }
    .term-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
    .term-card { background: #fbfbfd; border-radius: 10px; padding: 16px; border: 1px solid #e8e8ed; }
    .term-name { font-weight: 600; font-size: 14px; color: #1d1d1f; margin-bottom: 6px; }
    .term-desc { font-size: 12px; color: #86868b; line-height: 1.5; }
    .data-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .data-card { text-align: center; padding: 24px; background: linear-gradient(135deg, #1d1d1f 0%, #434344 100%); color: white; border-radius: 12px; }
    .data-number { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
    .data-label { font-size: 13px; opacity: 0.8; }
    .heatmap { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
    .heat-item { padding: 16px; border-radius: 10px; text-align: center; }
    .heat-hot { background: linear-gradient(135deg, #ffebee, #ffcdd2); color: #c62828; }
    .heat-warm { background: linear-gradient(135deg, #fff3e0, #ffe0b2); color: #ef6c00; }
    .heat-cool { background: linear-gradient(135deg, #e8f5e9, #c8e6c9); color: #2e7d32; }
    .heat-item .heat-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .heat-item .heat-status { font-size: 12px; opacity: 0.8; }
    .source-list { font-size: 12px; color: #86868b; }
    .source-list li { margin-bottom: 8px; line-height: 1.5; }
    .source-list a { color: #0071e3; text-decoration: none; }
    .source-list a:hover { text-decoration: underline; }
    .footer { text-align: center; padding: 30px; color: #86868b; font-size: 13px; }
    @media (max-width: 768px) {
      .hero h1 { font-size: 24px; }
      .content-grid { grid-template-columns: 1fr; }
      .quote-grid { grid-template-columns: 1fr; }
      .container { padding: 10px; }
      .section { padding: 20px; }
    }
  `,

  // 渲染器：将数据对象转换为完整HTML
  render(data) {
    const today = data.date || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const timeStr = data.time || '07:17 CST';

    // 构建英雄区
    const heroHTML = this.buildHero(data.hero, today, timeStr);

    // 构建各板块
    const sections = [
      this.buildRecommendations(data.recommendations),
      this.buildNewsSection('🤖', 'AI DevOps 前沿', data.aiDevOps),
      this.buildNewsSection('🏢', '头部AI公司动态', data.aiCompanies),
      this.buildNewsSection('🦾', '具身智能/机器人', data.robotics),
      this.buildNewsSection('☁️', '云原生与数据', data.cloudNative),
      this.buildNewsSection('📊', '项目管理与效能', data.projectManagement),
      this.buildGlobalTable(data.global),
      this.buildQuotes(data.quotes),
      this.buildTerms(data.terms),
      this.buildDataHighlights(data.dataHighlights),
      this.buildAnalysis(data.analysis),
      this.buildHeatmap(data.heatmap),
      this.buildSources(data.sources),
    ];

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>豆饼晨报 | ${today}</title>
    <style>${this.styles}</style>
</head>
<body>
    <div class="container">
        ${heroHTML}
        ${sections.join('\n')}
        <div class="footer">
            <p>❤️‍🔥 豆饼晨报 | 由 豆饼(Doubing) 自动生成</p>
            <p>数据来源：公开新闻报道与官方公告 | 仅供参考，不构成投资建议</p>
            <p>生成时间：${today} ${timeStr}</p>
        </div>
    </div>
</body>
</html>`;
  },

  buildHero(hero, date, time) {
    if (!hero) return '';
    return `<div class="hero">
            <div class="hero-badge">🔥 今日核心洞察</div>
            <h1>${this.escapeHtml(hero.title)}</h1>
            <div class="hero-summary">${this.escapeHtml(hero.summary)}</div>
            <div class="hero-meta">
                <span>📅 ${date}</span>
                <span>⏰ ${time}</span>
                <span>🤖 豆饼晨报</span>
                <span>📊 14个板块</span>
            </div>
        </div>`;
  },

  buildRecommendations(recs) {
    if (!recs || !recs.length) return '';
    const cards = recs.map(r => `<div class="card">
                    <h3>${this.escapeHtml(r.title)}</h3>
                    <p>${this.escapeHtml(r.content)}</p>
                    <span class="tag tag-${r.priority || 'p2'}">${r.priority === 'p0' ? 'P0 - 立即行动' : r.priority === 'p1' ? 'P1 - 本周规划' : 'P2 - 本月试点'}</span>
                </div>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">🛠️</span> 务实落地建议</div>
            <div class="content-grid">${cards}</div>
        </div>`;
  },

  buildNewsSection(icon, title, items) {
    if (!items || !items.length) return '';
    const newsHTML = items.map(item => `<div class="news-item">
                <div class="news-header">
                    <span class="news-title">${this.escapeHtml(item.title)}</span>
                    <span class="tag tag-${item.priority || 'p2'}">${item.priority ? item.priority.toUpperCase() : 'P2'}</span>
                </div>
                <div class="news-desc">${this.escapeHtml(item.desc)}<span class="news-source">来源：${this.escapeHtml(item.source)}</span></div>
            </div>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">${icon}</span> ${title}</div>
            ${newsHTML}
        </div>`;
  },

  buildGlobalTable(rows) {
    if (!rows || !rows.length) return '';
    const trs = rows.map(r => `<tr><td>${this.escapeHtml(r.region)}</td><td>${this.escapeHtml(r.event)}</td><td><span class="tag tag-${r.priority || 'p2'}">${r.priority ? r.priority.toUpperCase() : 'P2'}</span></td></tr>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">🌐</span> 全球动态</div>
            <table>
                <tr><th>地区/领域</th><th>关键事件</th><th>影响评级</th></tr>
                ${trs}
            </table>
        </div>`;
  },

  buildQuotes(quotes) {
    if (!quotes || !quotes.length) return '';
    const cards = quotes.map(q => `<div class="quote-card">
                    <div class="quote-text">"${this.escapeHtml(q.text)}"</div>
                    <div class="quote-author">${this.escapeHtml(q.author)}</div>
                    <div class="quote-title">${this.escapeHtml(q.title)} | ${this.escapeHtml(q.source)}</div>
                </div>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">🎙️</span> 大咖声音</div>
            <div class="quote-grid">${cards}</div>
        </div>`;
  },

  buildTerms(terms) {
    if (!terms || !terms.length) return '';
    const cards = terms.map(t => `<div class="term-card">
                    <div class="term-name">${this.escapeHtml(t.name)}</div>
                    <div class="term-desc">${this.escapeHtml(t.desc)}</div>
                </div>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">📖</span> 名字解释</div>
            <div class="term-grid">${cards}</div>
        </div>`;
  },

  buildDataHighlights(data) {
    if (!data || !data.length) return '';
    const cards = data.map(d => `<div class="data-card">
                    <div class="data-number">${this.escapeHtml(d.number)}</div>
                    <div class="data-label">${this.escapeHtml(d.label)}</div>
                </div>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">📊</span> 关键数据速览</div>
            <div class="data-grid">${cards}</div>
        </div>`;
  },

  buildAnalysis(items) {
    if (!items || !items.length) return '';
    const newsItems = items.map(item => `<div class="news-item">
                <div class="news-header">
                    <span class="news-title">${this.escapeHtml(item.title)}</span>
                </div>
                <div class="news-desc">${this.escapeHtml(item.desc)}</div>
            </div>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">💡</span> 深度分析</div>
            ${newsItems}
        </div>`;
  },

  buildHeatmap(items) {
    if (!items || !items.length) return '';
    const heatClass = { hot: 'heat-hot', warm: 'heat-warm', cool: 'heat-cool' };
    const heatIcons = { hot: '🔥🔥🔥', warm: '🔥🔥', cool: '🔥' };
    const cards = items.map(item => `<div class="heat-item ${heatClass[item.level] || 'heat-cool'}">
                    <div class="heat-name">${this.escapeHtml(item.name)}</div>
                    <div class="heat-status">${heatIcons[item.level] || '🔥'} ${this.escapeHtml(item.status)}</div>
                </div>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">🔥</span> 行业热力图</div>
            <div class="heatmap">${cards}</div>
            <p style="margin-top: 16px; font-size: 13px; color: #86868b;">
                <strong>状态说明：</strong>🔥🔥🔥 极度活跃 = 该领域近期有重大资本事件或技术突破，建议重点关注；🔥🔥 快速升温 = 有持续进展但尚未形成行业级爆发；🔥 持续跟踪 = 长期趋势明确但短期动作有限。热力图基于过去30天内的行业动态综合评估。
            </p>
        </div>`;
  },

  buildSources(sources) {
    if (!sources || !sources.length) return '';
    const items = sources.map(s => `<li><strong>${this.escapeHtml(s.title)}</strong> | 发布时间：${this.escapeHtml(s.date)} | 作者/机构：${this.escapeHtml(s.author)} | <a href="${this.escapeHtml(s.url)}">原文链接：${this.escapeHtml(s.linkTitle)}</a></li>`).join('');
    return `<div class="section">
            <div class="section-title"><span class="icon">📚</span> 权威来源</div>
            <ul class="source-list">${items}</ul>
        </div>`;
  },

  escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};

// 导出供生成器页面使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MorningNewsTemplate;
}
