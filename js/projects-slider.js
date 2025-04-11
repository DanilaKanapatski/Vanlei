document.addEventListener('DOMContentLoaded', () => {
    const projectsSlider = document.querySelector('.projects-slider');
    const slides = projectsSlider.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.projects-pagination .prev-btn');
    const nextBtn = document.querySelector('.projects-pagination .next-btn');
    const currentSlideEl = document.querySelector('.projects-nav .current-slide');
    const totalSlidesEl = document.querySelector('.projects-nav .total-slides');

    let currentIndex = 0;
    const totalSlides = slides.length; // 14
    const visibleSlides = 3;
    const totalSteps = totalSlides; // 14 переходов
    let autoplayInterval;

    // Устанавливаем общее количество переходов
    totalSlidesEl.textContent = `/${totalSteps < 10 ? '0' + totalSteps : totalSteps}`;

    // Автопрокрутка
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToNextSlide();
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function goToNextSlide() {
        if (currentIndex < totalSteps - 1) {
            goToSlide(currentIndex + 1);
        } else {
            // Последний переход - показываем только 1 слайд
            goToSlide(currentIndex + 1);
            // Затем начинаем заново
            setTimeout(() => {
                goToSlide(0);
            }, 3000);
        }
    }

    // Инициализация слайдов
    function initSlides() {
        slides.forEach((slide, index) => {
            slide.style.opacity = '0';
            slide.style.zIndex = '0';

            if (index < visibleSlides) {
                slide.style.opacity = '1';
                slide.style.zIndex = visibleSlides - index;
                slide.dataset.size = index === 0 ? 'large' : index === 1 ? 'medium' : 'small';
                if (index === 0) slide.classList.add('active');
            }
        });
        updateCounter();
        startAutoplay();
    }

    // Обновление счетчика
    function updateCounter() {
        const stepNumber = Math.min(currentIndex + 1, totalSteps);
        currentSlideEl.textContent = stepNumber < 10 ? `0${stepNumber}` : stepNumber;
    }

    // Переключение слайдов
    function goToSlide(newIndex) {
        currentIndex = newIndex >= totalSteps ? totalSteps - 1 : newIndex;

        // Скрываем все слайды
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.classList.remove('active');
            slide.style.zIndex = '0';
        });

        // Определяем сколько слайдов показывать
        let slidesToShow = visibleSlides;
        if (currentIndex >= totalSlides - visibleSlides) {
            slidesToShow = totalSlides - currentIndex;
        }

        // Показываем нужные слайды
        for (let i = 0; i < slidesToShow; i++) {
            const slide = slides[currentIndex + i];
            if (slide) {
                slide.style.opacity = '1';
                slide.style.zIndex = slidesToShow - i;

                // Распределяем размеры
                if (slidesToShow === 3) {
                    slide.dataset.size = i === 0 ? 'large' : i === 1 ? 'medium' : 'small';
                } else if (slidesToShow === 2) {
                    slide.dataset.size = i === 0 ? 'large' : 'medium';
                } else {
                    slide.dataset.size = 'large';
                }

                if (i === 0) slide.classList.add('active');
            }
        }

        updateCounter();
    }

    // Кнопки навигации
    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        if (currentIndex < totalSteps - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Возврат к началу
        }
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(totalSteps - 1); // Переход к концу
        }
        startAutoplay();
    });

    // Остановка автопрокрутки при наведении
    projectsSlider.addEventListener('mouseenter', stopAutoplay);
    projectsSlider.addEventListener('mouseleave', startAutoplay);

    initSlides();
});