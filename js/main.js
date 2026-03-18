// OpenClaw Morning News - 日期导航功能

document.addEventListener('DOMContentLoaded', function() {
    // 获取当前日期
    const currentDateEl = document.getElementById('currentDate');
    const prevBtn = document.getElementById('prevDate');
    const nextBtn = document.getElementById('nextDate');
    
    if (!currentDateEl || !prevBtn || !nextBtn) return;
    
    // 解析当前日期
    const dateText = currentDateEl.textContent.trim();
    const match = dateText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    
    if (!match) return;
    
    const year = parseInt(match[1]);
    const month = parseInt(match[2]);
    const day = parseInt(match[3]);
    
    // 生成文件名函数
    function getNewsFileName(y, m, d) {
        return `news_${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}.html`;
    }
    
    // 前一天按钮点击
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const currentDate = new Date(year, month - 1, day);
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        
        const py = prevDate.getFullYear();
        const pm = prevDate.getMonth() + 1;
        const pd = prevDate.getDate();
        
        // 检查是否是最早日期（3月13日）
        if (py === 2026 && pm === 3 && pd < 13) {
            alert('没有更早的晨报了');
            return;
        }
        
        const prevFile = getNewsFileName(py, pm, pd);
        window.location.href = prevFile;
    });
    
    // 后一天按钮点击
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const currentDate = new Date(year, month - 1, day);
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        
        const ny = nextDate.getFullYear();
        const nm = nextDate.getMonth() + 1;
        const nd = nextDate.getDate();
        
        // 检查是否是最新日期（3月18日）
        if (ny === 2026 && nm === 3 && nd > 18) {
            alert('已经是最新的晨报了');
            return;
        }
        
        const nextFile = getNewsFileName(ny, nm, nd);
        
        // 3月18日是index.html，其他是news_YYYYMMDD.html
        if (ny === 2026 && nm === 3 && nd === 18) {
            window.location.href = 'index.html';
        } else {
            window.location.href = nextFile;
        }
    });
    
    // 移动端触摸优化
    if ('ontouchstart' in window) {
        prevBtn.style.touchAction = 'manipulation';
        nextBtn.style.touchAction = 'manipulation';
    }
});
