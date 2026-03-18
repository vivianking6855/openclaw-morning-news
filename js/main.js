// OpenClaw Morning News - 日期导航功能
(function() {
    'use strict';
    
    function initNavigation() {
        var currentDateEl = document.getElementById('currentDate');
        var prevBtn = document.getElementById('prevDate');
        var nextBtn = document.getElementById('nextDate');
        
        if (!currentDateEl || !prevBtn || !nextBtn) return;
        
        // 解析当前日期
        var dateText = currentDateEl.textContent.trim();
        var match = dateText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        
        if (!match) return;
        
        var year = parseInt(match[1], 10);
        var month = parseInt(match[2], 10);
        var day = parseInt(match[3], 10);
        
        // 生成文件名函数
        function getNewsFileName(y, m, d) {
            return 'news_' + y + String(m).padStart(2, '0') + String(d).padStart(2, '0') + '.html';
        }
        
        // 导航函数
        function goToDate(targetYear, targetMonth, targetDay) {
            var targetFile;
            if (targetYear === 2026 && targetMonth === 3 && targetDay === 18) {
                targetFile = 'index.html';
            } else {
                targetFile = getNewsFileName(targetYear, targetMonth, targetDay);
            }
            window.location.href = targetFile;
        }
        
        // 前一天
        function goToPrevDate(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            
            var currentDate = new Date(year, month - 1, day);
            var prevDate = new Date(currentDate);
            prevDate.setDate(currentDate.getDate() - 1);
            
            var py = prevDate.getFullYear();
            var pm = prevDate.getMonth() + 1;
            var pd = prevDate.getDate();
            
            if (py === 2026 && pm === 3 && pd < 13) {
                alert('没有更早的晨报了');
                return false;
            }
            
            goToDate(py, pm, pd);
            return false;
        }
        
        // 后一天
        function goToNextDate(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            
            var currentDate = new Date(year, month - 1, day);
            var nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + 1);
            
            var ny = nextDate.getFullYear();
            var nm = nextDate.getMonth() + 1;
            var nd = nextDate.getDate();
            
            if (ny === 2026 && nm === 3 && nd > 18) {
                alert('已经是最新的晨报了');
                return false;
            }
            
            goToDate(ny, nm, nd);
            return false;
        }
        
        // 绑定点击事件 - 同时支持click和touchend
        prevBtn.addEventListener('click', goToPrevDate, false);
        nextBtn.addEventListener('click', goToNextDate, false);
        
        // 移动端优化 - touchend更快响应
        if ('ontouchstart' in window) {
            prevBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                goToPrevDate(e);
            }, false);
            
            nextBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                goToNextDate(e);
            }, false);
            
            // 防止300ms延迟
            prevBtn.style.touchAction = 'manipulation';
            nextBtn.style.touchAction = 'manipulation';
        }
        
        // 添加视觉反馈
        [prevBtn, nextBtn].forEach(function(btn) {
            btn.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            }, false);
            btn.addEventListener('touchend', function() {
                this.style.opacity = '1';
            }, false);
        });
    }
    
    // 多种方式确保初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation, false);
    } else {
        initNavigation();
    }
    
    // 备用初始化
    window.addEventListener('load', initNavigation, false);
})();
