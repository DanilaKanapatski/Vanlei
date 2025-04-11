document.addEventListener('DOMContentLoaded', function() {
    const vrBtn = document.querySelector('.vr-btn');
    const popup = document.getElementById('popup');
    const popupClose = document.querySelector('.popup-close');
    const popupOverlay = document.querySelector('.popup-overlay');

    // Открытие попапа
    vrBtn.addEventListener('click', function() {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Закрытие попапа
    function closePopup() {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    popupClose.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);

    // Закрытие при нажатии ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.style.display === 'flex') {
            closePopup();
        }
    });
});