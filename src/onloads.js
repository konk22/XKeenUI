// Вызов функций при загрузке страницы
window.onload = function () {
    setCheckboxState();  // Устанавливаем состояние чекбоксов из 03_inbounds.json
    setOutboundCheckboxState();  // Устанавливаем состояние чекбоксов из 04_outbounds.json
    setVlessInputField();  // Устанавливаем VLESS строку для "out-russia"
    setVlessInputFieldForInRussia();  // Устанавливаем VLESS строку для "in-russia"
    populateTables();  // Заполняем таблицы данными из 05_routing.json
    hidden_editor()
    checkServiceStatus();  // Проверяем статус службы
};