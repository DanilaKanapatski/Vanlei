document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.main-slider');
    const slides = document.querySelectorAll('.main-slider img');
    const slideCount = slides.length;
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoSlideInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    // Инициализация слайдов
    slides.forEach((slide, index) => {
        // Touch события
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);

        // Mouse события
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });

    // Отключаем контекстное меню
    window.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function touchStart(index) {
        return function(event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            stopAutoSlide();

            animationID = requestAnimationFrame(animation);
            slider.classList.add('grabbing');
        }
    }

    function touchEnd() {
        if (!isDragging) return;

        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentIndex < slideCount - 1) {
            currentIndex += 1;
        }

        if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        setPositionByIndex();
        slider.classList.remove('grabbing');
        startAutoSlide();
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        currentTranslate = currentIndex * -slider.offsetWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    // Автопереключение
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            setPositionByIndex();
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        stopAutoSlide();

        switch(e.key) {
            case 'ArrowLeft':
                currentIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'ArrowRight':
                currentIndex = Math.min(currentIndex + 1, slideCount - 1);
                break;
            default:
                return;
        }

        setPositionByIndex();
        startAutoSlide();
    });

    // Запускаем автопереключение
    startAutoSlide();

    // Останавливаем при скрытии вкладки
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
});

