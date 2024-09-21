document.getElementById('reload-btn').addEventListener('click', async function () {
    changeCircleColor(false)
    const response = await fetch('/restart', {
        method: 'GET'
    });

    if (response.ok) {
        showModal('Команда перезагрузки отправлена');
    } else {
        showModal('Ошибка при отправке команды перезагрузки');
    }
}); 