document.querySelectorAll('.add-domain-btn').forEach(button => {
    button.addEventListener('click', async function () {
        const table = this.closest('div').querySelector('table');
        if (!table) return;  // Проверка, что таблица существует

        const newRow = document.createElement('tr');
        let datFiles = [];

        try {
            datFiles = await fetchDatFiles();  // Получаем список файлов .dat
        } catch (error) {
            console.error('Ошибка при получении списка .dat файлов:', error);
        }

        // Базовые опции для select
        const select = document.createElement('select');
        const options = [
            { value: 'null', text: '' },
            { value: 'domain', text: 'domain' },
            { value: 'regexp:^([\\w\\-\\.]+\\.)', text: 'regexp:^([\\w\\-\\.]+\\.)' }
        ];

        // Добавление базовых опций в select
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.text = option.text;
            select.appendChild(optElement);
        });

        // Добавление опций из datFiles
        datFiles.forEach(file => {
            const optElement = document.createElement('option');
            optElement.value = file;
            optElement.text = file;
            select.appendChild(optElement);
        });

        // Создание ячеек строки
        newRow.innerHTML = `
            <td><input type="checkbox" checked></td>
            <td></td>
            <td><input type="text" placeholder="Введите домен"></td>
            <td><button class="delete-btn">Удалить</button></td>
        `;

        // Вставляем select в соответствующую ячейку
        newRow.querySelector('td:nth-child(2)').appendChild(select);

        // Добавляем строку в таблицу
        table.appendChild(newRow);

        // Логика для удаления строки
        newRow.querySelector('.delete-btn').addEventListener('click', function () {
            newRow.remove();
        });
    });
});
