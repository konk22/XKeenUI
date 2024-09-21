// Функция для получения данных из 05_routing.json
async function fetchRoutingData() {
    const response = await fetch('/routing');
    const routingData = await response.json();
    return routingData;
}

// Функция для создания строки таблицы
function createTableRow(type, value, isChecked) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" ${isChecked ? 'checked' : ''}></td>
        <td>${type}</td>
        <td>${value}</td>
        <td><button class="delete-btn">Удалить</button></td>
    `;
    return row;
}

// Функция для создания строки таблицы для domain (input type="text")
function createTableRowForDomain(value, datFiles, isChecked) {
    const row = document.createElement('tr');
    let selectOptions = `
        <select>
            <option value="null" ${!value.includes("ext:geosite") && !value.includes("regexp") && !value.includes("domain") ? "selected" : ""}></option>
            <option value="domain" ${value.includes("domain:") ? "selected" : ""}>domain</option>
            <option value="regexp:^([\\w\\-\\.]+\\.)" ${value.includes("regexp") ? "selected" : ""}>regexp:^([\\w\\-\\.]+\\.)</option>
        `;

    // Добавляем файлы .dat в список опций
    datFiles.forEach(file => {
        const fileName = `ext:geosite_${file}`;
        selectOptions += `<option value="${fileName}" ${value.includes(file) ? "selected" : ""}>${file}</option>`;
    });

    selectOptions += `</select>`;

    row.innerHTML = `
        <td><input type="checkbox" ${isChecked ? 'checked' : ''}></td>
        <td>${selectOptions}</td>
        <td><input type="text" value="${value}"></td>
        <td><button class="delete-btn">Удалить</button></td>
    `;
    return row;
}

// Функция для создания строки таблицы для protocol
function createTableRowForProtocol(value, isChecked) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="checkbox" ${isChecked ? 'checked' : ''}></td>
        <td><input id="protocol" type="text" value="${value}"></td>
        <td></td>
        <td><button class="delete-btn">Удалить</button></td>
    `;
    return row;
}

// Функция для обработки значений и их отображения в текстовом поле
function processDomainValue(value) {
    if (value.includes("ext:geosite")) {
        return value.split(':').pop();
    } else if (value.includes("regexp")) {
        return value.match(/regexp:\^.*\\.\)([^$]+)/)?.[1] || value;
    } else if (value.includes("domain")) {
        return value.split('domain:').pop();
    } else {
        return value;
    }
}

// Функция для создания строки таблицы для domain (input type="text")
function createTableRowForDomain(value, datFiles, isChecked) {
    const processedValue = processDomainValue(value); // Обрабатываем строку

    const row = document.createElement('tr');
    let selectOptions = `
        <select>
            <option value="null" ${!value.includes("ext:geosite") && !value.includes("regexp") && !value.includes("domain") ? "selected" : ""}></option>
            <option value="domain" ${value.includes("domain:") ? "selected" : ""}>domain</option>
            <option value="regexp:^([\\w\\-\\.]+\\.)" ${value.includes("regexp") ? "selected" : ""}>regexp:^([\\w\\-\\.]+\\.)</option>
    `;

    // Добавляем файлы .dat в список опций
    datFiles.forEach(file => {
        const fileName = `ext:geosite_${file}`;
        selectOptions += `<option value="${fileName}" ${value.includes(file) ? "selected" : ""}>${file}</option>`;
    });

    selectOptions += `</select>`;

    row.innerHTML = `
        <td><input type="checkbox" ${isChecked ? 'checked' : ''}></td>
        <td>${selectOptions}</td>
        <td><input type="text" value="${processedValue}"></td>
        <td><button class="delete-btn">Удалить</button></td>
    `;
    return row;
}

// Функция для создания строки таблицы для protocol (select)
function createTableRowForProtocol(value, isChecked) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="checkbox" ${isChecked ? 'checked' : ''}></td>
        <td><input id="protocol" type="text" value="${value}"></td>
        <td></td>
        <td><button class="delete-btn">Удалить</button></td>
    `;
    return row;
}

// Функция для создания строки таблицы для port (input type="text")
function createTableRowForPort(port, network, targetTable, isChecked) {
    let selectOptions = '';
    const hasTcpSelected = Array.from(targetTable.querySelectorAll('select')).some(select => 
        select.value === 'TCP'
    );
    const hasUdpSelected = Array.from(targetTable.querySelectorAll('select')).some(select => 
        select.value === 'UDP'
    );

    if (targetTable.classList.contains('dns_table')) {
        selectOptions = `<option value="TCP/UDP">TCP/UDP</option>`;
    } else {
        // Если пункт TCP уже есть, не добавляем его
        if (!hasTcpSelected) {
            selectOptions += `<option value="TCP">TCP</option>`;
        }
        // Есди пункт UDP уже есть, не добавляем его
        else if (!hasUdpSelected) {
            selectOptions += `<option value="UDP">UDP</option>`;
        }
        else {
            showModal('Настройки портов в таблицу уже добавлены');
            return;
        }
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" ${isChecked ? 'checked' : ''}></td>
        <td>
            <select>
                ${selectOptions}
            </select>
        </td>
        <td><input type="text" value="${port}"></td>
        <td><button class="delete-btn">Удалить</button></td>
    `;
    return row;
}

// Функция для создания строки таблицы для dns (input type="text")
function createTableRowForDns(port, isChecked) {
    let selectOptions = `
        <option value="TCP/UDP">TCP/UDP</option>
    `;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" ${isChecked ? 'checked' : ''}></td>
        <td>
            <select>
                ${selectOptions}
            </select>
        </td>
        <td><input type="text" value="${port}"></td>
        <td><button class="delete-btn">Удалить</button></td>
    `;
    return row;
}

// Функция для удаления строки
function addDeleteFunctionality(row) {
    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function () {
        row.remove();
    });
}

// Функция для заполнения таблиц на основе данных из 05_routing.json
async function populateTables() {
    const routingData = await fetchRoutingData();
    const datFiles = await fetchDatFiles(); // Получаем список .dat файлов

    // Таблицы для "out_russia", "in_russia", "direct", "block", "dns"
    const outRussiaTable = document.querySelector('.out_russia');
    const inRussiaTable = document.querySelector('.in_russia');
    const directTable = document.querySelector('.direct_table');
    const blockTable = document.querySelector('.block_table');
    const dnsTable = document.querySelector('.dns_table');

    routingData.routing.rules.forEach(rule => {
        const { outboundTag, domain, protocol, port, network, disabled_rules = [] } = rule;

        // Выбираем таблицу для заполнения по outboundTag
        let targetTable;
        switch (outboundTag) {
            case 'block':
                targetTable = blockTable;
                break;
            case 'direct':
                targetTable = directTable;
                break;
            case 'dns':
                targetTable = dnsTable;
                break;
            case 'out-russia':
                targetTable = outRussiaTable;
                break;
            case 'in-russia':
                targetTable = inRussiaTable;
                break;
            default:
                return;  // Пропускаем, если нет нужного outboundTag
        }

        // Добавляем строки для "domain"
        if (domain) {
            domain.forEach(value => {
                const isChecked = !disabled_rules.includes(value);
                const row = createTableRowForDomain(value, datFiles, isChecked);
                addDeleteFunctionality(row);
                targetTable.appendChild(row);
            });
        }

        // Добавляем строки для "protocol"
        if (protocol) {
            protocol.forEach(value => {
                const isChecked = !disabled_rules.includes(value);
                const row = createTableRowForProtocol(value, isChecked);
                addDeleteFunctionality(row);
                targetTable.appendChild(row);
            });
        }

        // Добавляем строки для "port" и "network"
        if (port && network) {
            const isChecked = !disabled_rules.some(rule => rule.port === port && rule.network === network);
            const row = createTableRowForPort(port, network, targetTable, isChecked);
            addDeleteFunctionality(row);
            targetTable.appendChild(row);
        }

        // Добавляем строки для "port" и "network"
        if (targetTable === dnsTable && port) {
            const isChecked = !disabled_rules.some(rule => rule.port === port);
            const row = createTableRowForDns(port, isChecked);
            addDeleteFunctionality(row);
            targetTable.appendChild(row);
        }

        // Обработка disabled_rules (для network и port)
        if (disabled_rules.length > 0) {
            disabled_rules.forEach(rule => {
                // Если disabled_rules содержит объекты с полями network и port
                if (rule.network && rule.port) {
                    const row = createTableRowForPort(rule.port, rule.network, false); // Чекбокс отключен
                    addDeleteFunctionality(row);
                    targetTable.appendChild(row);
                } else if (domain) {
                    // Если это домен в disabled_rules
                    const row = createTableRowForDomain(rule, datFiles, false); // Чекбокс отключен
                    addDeleteFunctionality(row);
                    targetTable.appendChild(row);
                } else if (protocol) {
                    // Если это протокол в disabled_rules
                    const row = createTableRowForProtocol(rule, false); // Чекбокс отключен
                    addDeleteFunctionality(row);
                    targetTable.appendChild(row);
                }
            });
        }
    });
}