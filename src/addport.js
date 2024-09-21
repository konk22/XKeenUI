// Функция для создания новой строки таблицы
function createPortRow(selectOptions) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="checkbox" checked></td>
        <td>
            <select>
                ${selectOptions}
            </select>
        </td>
        <td><input type="text" placeholder="Введите порты через запятую"></td>
        <td><button class="delete-btn">Удалить</button></td>
    `;

    // Логика для удаления строки
    newRow.querySelector('.delete-btn').addEventListener('click', () => {
        newRow.remove();
    });

    return newRow;
}

// Функция для добавления строки в таблицу TCP UDP
function addPortRow(table) {
    let selectOptions = '';
    const hasTcpSelected = Array.from(table.querySelectorAll('select')).some(select => 
        select.value === 'TCP'
    );
    const hasUdpSelected = Array.from(table.querySelectorAll('select')).some(select => 
        select.value === 'UDP'
    );

    // Получаем текст из <span class="toggle-label">, связанного с таблицей
    const tableWrapper = table.closest('.table-wrapper'); // Ищем обертку таблицы
    const labelSpan = tableWrapper ? tableWrapper.querySelector('.toggle-label') : null;
    const tableLabel = labelSpan ? labelSpan.textContent : 'Таблица'; // Получаем текст или используем 'Таблица'


    if (table.classList.contains('dns_table')) {
        selectOptions = `<option value="TCP/UDP">TCP/UDP</option>`;
    } else {
        // Если пункт TCP уже есть, не добавляем его
        if (!hasTcpSelected) {
            selectOptions += `<option value="TCP">TCP</option>`;
        }
        // Есди пункт UDP уже есть, не добавляем его
        if (!hasUdpSelected) {
            selectOptions += `<option value="UDP">UDP</option>`;
        }
        else {
            showModal(`Настройки портов в таблице "${tableLabel}" уже добавлены.<br>Заполните порты через запятую напротив нужного протокола.`);
            return;
        }
    }

    const newRow = createPortRow(selectOptions);
    table.appendChild(newRow);
}

// Обработчик для кнопки "Добавить порт"
document.querySelectorAll('.add-port-btn').forEach(button => {
    button.addEventListener('click', function () {
        const table = this.closest('div').querySelector('table');
        addPortRow(table);
    });
});
