document.getElementById('stop-btn').addEventListener('click', async function () {
    const response = await fetch('/stop', {
        method: 'GET'
    });

    if (response.ok) {
        showModal('Команда остановки отправлена');
    } else {
        showModal('Ошибка при отправке команды остановки');
    }
});