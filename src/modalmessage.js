// Функция для отображения модального окна с автоматическим скрытием
function showModal(message) {
    const modal = document.getElementById('alert_modal');
    const modalMessage = document.getElementById('alert_message');
    modalMessage.innerHTML = message;

    // Отображаем модальное окно с классом 'show'
    modal.classList.add('show');
    
    // Через 2 секунды начинаем плавное скрытие
    setTimeout(function() {
        modal.classList.remove('show');
    }, 2000); // Модальное окно будет видно 2 секунды
}