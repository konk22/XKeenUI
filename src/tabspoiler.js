// Общая функция для переключения видимости блоков
function toggleVisibility(toggleId, contentId) {
    const content = document.getElementById(contentId);
    const toggleIcon = document.getElementById(toggleId);
    
    content.classList.toggle('hidden');
    content.classList.toggle('visible');

    // Меняем символ стрелки в зависимости от состояния контента
    if (content.classList.contains('hidden')) {
        toggleIcon.innerHTML = '▼'; // Стрелка вниз (контент скрыт)
    } else {
        toggleIcon.innerHTML = '▶'; // Стрелка вправо (контент виден)
    }
}

// Привязка событий к кнопкам
const toggles = [
    { toggleId: 'outRussiaToggle', contentId: 'outRussiaBody' },
    { toggleId: 'inRussiaToggle', contentId: 'inRussiaBody' },
    { toggleId: 'directToggle', contentId: 'directBody' },
    { toggleId: 'blockToggle', contentId: 'blockBody' },
    { toggleId: 'dnsToggle', contentId: 'dnsBody' }
];

// Привязываем к каждому toggle обработчик событий
toggles.forEach(item => {
    document.getElementById(item.toggleId).addEventListener('click', function() {
        toggleVisibility(item.toggleId, item.contentId);
    });
});
