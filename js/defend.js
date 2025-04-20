document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
document.addEventListener('copy', function(e) {
    e.clipboardData.setData('text/plain', 'Копирование запрещено');
    e.preventDefault();
});
// setInterval(function() {
//     if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
//         document.body.innerHTML = 'Доступ запрещен';
//     }
// }, 1000);

document.addEventListener('keydown', function(e) {
    // Блокировка Ctrl+S (Windows) / Cmd+S (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('Сохранение страницы запрещено');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Скриншоты запрещены');
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'c')) {
        navigator.clipboard.writeText('Скопировать содержимое запрещено');
        alert('Скриншоты запрещены');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Power' || e.key === 'VolumeDown' || e.key === 'VolumeUp') {
        e.preventDefault();
    }
});

let isTakingScreenshot = false;

document.addEventListener('keydown', function(e) {
    if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 's')) {
        isTakingScreenshot = true;
        document.body.style.filter = 'blur(5px)';
        setTimeout(() => {
            document.body.style.filter = 'none';
            isTakingScreenshot = false;
        }, 2000);
    }
});

// setInterval(() => {
//     if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
//         document.body.innerHTML = '<h1 style="color:red;">Доступ к инструментам разработчика запрещен</h1>';
//         window.location.href = 'about:blank';
//     }
// }, 1000);