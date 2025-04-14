document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.characteristics-list li');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех вкладок
            tabs.forEach(t => t.classList.remove('active'));

            // Добавляем активный класс текущей вкладке
            this.classList.add('active');

            // Получаем атрибут data-tab
            const tabName = this.getAttribute('data-tab');

            // Скрываем все блоки
            document.querySelector('.properties').style.display = 'none';
            document.querySelector('.application').style.display = 'none';
            document.querySelector('.instructions').style.display = 'none';

            // Показываем нужный блок
            if (tabName === 'properties') {
                document.querySelector('.properties').style.display = 'flex';
            } else if (tabName === 'application') {
                document.querySelector('.application').style.display = 'block';
            } else if (tabName === 'instructions') {
                document.querySelector('.instructions').style.display = 'flex';
            }
        });
    });
});