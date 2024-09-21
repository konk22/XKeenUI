// Функция для получения данных из 03_inbounds.json
async function fetchInboundsData() {
    const response = await fetch('/inbounds');
    const inboundsData = await response.json();
    return inboundsData;
}

// Установка состояния чекбоксов на основе данных из 03_inbounds.json
async function setCheckboxState() {
    const inboundsData = await fetchInboundsData();
    const mixedCheckbox = document.getElementById('radio1'); // Mixed
    const tproxyCheckbox = document.getElementById('radio2'); // TProxy
    const redirectCheckbox = document.getElementById('radio3'); // Redirect

    // Собираем все теги из inbounds
    const tags = inboundsData.inbounds.map(inbound => inbound.tag);

    if (tags.includes("redirect") && tags.includes("tproxy")) {
        mixedCheckbox.checked = true;
    } else if (tags.includes("redirect")) {
        redirectCheckbox.checked = true;
    } else if (tags.includes("tproxy")) {
        tproxyCheckbox.checked = true;
    }
}