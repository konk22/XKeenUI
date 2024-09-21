// Функция для проверки статуса службы
async function checkServiceStatus() {
    try {
        const response = await fetch('/check_status');
        const data = await response.json();

        // Если статус "running", меняем цвет круга на зеленый
        if (data.status === 'running') {
            changeCircleColor(true);
        } else {
            changeCircleColor(false);
        }
    } catch (error) {
        console.error('Ошибка при проверке статуса службы:', error);
        changeCircleColor(false);  // Если возникла ошибка, ставим красный цвет
    }
}
// Функция для изменения цвета круга
function changeCircleColor(isGreen) {
    const circle = document.getElementById('statusCircle');
    if (isGreen) {
        circle.style.backgroundColor = 'green';
    } else {
        circle.style.backgroundColor = 'red';
    }
}

// Выполняем проверку статуса каждые 10 секунд
setInterval(checkServiceStatus, 10000);
