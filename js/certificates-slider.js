document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('#certificates .slider-container');
    const slides = document.querySelectorAll('#certificates .slide');
    const prevBtn = document.querySelector('#certificates .cert-prev-btn');
    const nextBtn = document.querySelector('#certificates .cert-next-btn');
    const currentSlideEl = document.querySelector('#certificates .current-slide');
    const totalSlidesEl = document.querySelector('#certificates .total-slides');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slidesToShow = 4;
    const totalSteps = totalSlides - slidesToShow + 1;
    let slideWidth = slides[0].offsetWidth + 10;
    let autoplayInterval;
    const autoplayDelay = 5000;

    // Переменные для обработки свайпа
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Минимальное расстояние свайпа для срабатывания

    // Инициализация
    function initSlider() {
        totalSlidesEl.textContent = `/${totalSteps < 10 ? '0' + totalSteps : totalSteps}`;
        updateSlider();
        startAutoplay();
    }

    // Автопрокрутка
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            if (currentIndex < totalSteps - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    // Обновление слайдера
    function updateSlider() {
        sliderContainer.style.transition = 'transform 0.5s ease';
        sliderContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        currentSlideEl.textContent = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1;

        prevBtn.disabled = false;
        nextBtn.disabled = false;

        if (currentIndex === 0) {
            prevBtn.classList.add('end-reached');
        } else {
            prevBtn.classList.remove('end-reached');
        }

        if (currentIndex >= totalSteps - 1) {
            nextBtn.classList.add('end-reached');
        } else {
            nextBtn.classList.remove('end-reached');
        }
    }

    // Обработчики свайпа для мобильных устройств
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, {passive: true});

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, {passive: true});

    function handleSwipe() {
        const difference = touchStartX - touchEndX;

        // Свайп вправо (показать предыдущий слайд)
        if (difference > swipeThreshold) {
            if (currentIndex < totalSteps - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
        }
        // Свайп влево (показать следующий слайд)
        else if (difference < -swipeThreshold) {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSteps - 1;
            }
        }

        updateSlider();
    }

    // Кнопка "Вперед"
    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        if (currentIndex < totalSteps - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
        startAutoplay();
    });

    // Кнопка "Назад"
    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalSteps - 1;
        }
        updateSlider();
        startAutoplay();
    });

    // Остановка при наведении
    const slider = document.querySelector('#certificates .certificates-slider');
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Ресайз
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth + 10;
        updateSlider();
    });

    initSlider();
});

// Остальной код с модальным окном остается без изменений
document.addEventListener('DOMContentLoaded', function() {
    const certSlides = document.querySelectorAll('.certificates .slide');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalImage = document.querySelector('.modal-image');
    const modalClose = document.querySelector('.modal-close');

    certSlides.forEach(slide => {
        slide.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            modalImage.setAttribute('src', imgSrc);
            modalImage.style.width = 'auto';
            modalImage.style.height = 'auto';
            modalImage.style.maxWidth = '90vw';
            modalImage.style.maxHeight = '90vh';
            modalImage.style.objectFit = 'contain';

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});