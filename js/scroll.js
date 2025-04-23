document.querySelector('.footer-scroll').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // для плавной прокрутки
    });
});

document.querySelector('.burger-btn').addEventListener('click', function() {
    document.querySelector('.header-mob').classList.toggle('active');
});