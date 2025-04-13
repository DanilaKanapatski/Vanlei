document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.main-slider');
    const slides = document.querySelectorAll('.main-slider img');
    const slideCount = slides.length;
    let currentIndex = 0;
    let interval;

    function goToSlide(index) {
        currentIndex = index;
        // Плавная прокрутка без прыжков страницы
        slider.scrollTo({
            left: slides[index].offsetLeft,
            behavior: 'smooth'
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        goToSlide(currentIndex);
    }

    function startAutoSlide() {
        stopAutoSlide();
        interval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(interval);
    }

    // Запускаем автопрокрутку
    startAutoSlide();

    // Останавливаем при взаимодействии пользователя
    slider.addEventListener('mousedown', stopAutoSlide);
    slider.addEventListener('touchstart', stopAutoSlide);
    slider.addEventListener('mouseup', startAutoSlide);
    slider.addEventListener('touchend', startAutoSlide);

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        stopAutoSlide();

        switch(e.key) {
            case 'ArrowLeft':
                prevSlide();
                break;
            case 'ArrowRight':
                nextSlide();
                break;
            default:
                return;
        }

        // Перезапускаем автопрокрутку после ручного управления
        setTimeout(startAutoSlide, 5000);
    });

    // Возобновляем при возвращении на вкладку
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }
    });

    // Отключаем стандартное поведение клавиш
    window.addEventListener('keydown', function(e) {
        if(['ArrowLeft','ArrowRight'].indexOf(e.key) > -1) {
            e.preventDefault();
        }
    }, false);
});