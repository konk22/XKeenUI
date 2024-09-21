document.querySelectorAll('.add-protocol-btn').forEach(button => {
    button.addEventListener('click', function () {
        const table = this.closest('div').querySelector('table');  // Ищем таблицу в том же блоке, где нажата кнопка
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td><input type="checkbox" checked></td>
            <td><input id="protocol" type="text" placeholder="Введите протокол"></td>
            <td></td>
            <td><button class="delete-btn">Удалить</button></td>
        `;

        table.appendChild(newRow);

        // Логика для удаления строки
        newRow.querySelector('.delete-btn').addEventListener('click', function () {
            newRow.remove();
        });
    });
});