// Функция для сохранения данных
async function saveData() {
    const lockToggleChecked = document.getElementById('lockToggle').checked;
    if (lockToggleChecked) {
        const inboundsData = generateInboundsJSON();
        const outboundsData = generateOutboundsJSON();

        // Отправляем все три файла по очереди
        await fetch('/save_inbounds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inboundsData)
        });

        await fetch('/save_outbounds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(outboundsData)
        });
    }
    const routingData = generateRoutingJSON();  // Генерируем routing.json
    const response = await fetch('/save_routing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(routingData)
    });

    // Использование модального окна вместо alert
    if (response.ok) {
        showModal('Данные успешно сохранены!');
        clearTables();  // Очищаем таблицы перед обновлением
        populateTables();  // Обновляем данные в таблицах
    } else {
        showModal('Ошибка при сохранении данных');
    }

}

// Функция для сохранения данных
document.getElementById('save-btn').addEventListener('click', saveData);