document.getElementById('rollback-btn').addEventListener('click', async function () {
    const response = await fetch('/restore', {
        method: 'POST'
    });

    if (response.ok) {
        showModal('Файлы успешно восстановлены из бэкапа');
        clearTables();  // Очищаем таблицы перед обновлением
        populateTables();  // Обновляем данные в таблицах
    } else {
        showModal('Ошибка при восстановлении бэкапа');
    }
});