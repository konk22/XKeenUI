let currentFile = '';  // Текущий редактируемый файл
let isSorting = false;  // Отслеживает режим сортировки
let tempJson = {};  // Временная переменная для хранения JSON
let editor = null;  // Переменная для Ace Editor
let placeholder = null;  // Переменная для хранения плейсхолдера

// Инициализация Ace Editor
function initAceEditor() {
    editor = ace.edit("json-editor");
    editor.setTheme("ace/theme/github");
    editor.session.setMode("ace/mode/json");
    editor.setOptions({
        fontSize: "14px",
        wrap: true,
    });
}

// Открытие модального окна с JSON
async function openJsonModal(file) {
    clearModalState();
    currentFile = file;
    try {
        const response = await fetch(`/${file}`);
        const data = await response.json();
        tempJson = JSON.parse(JSON.stringify(data));  // Глубокая копия данных
        editor.session.setValue(JSON.stringify(data, null, 2));  // Устанавливаем JSON в редактор
        document.getElementById('jsonModal').style.display = 'flex';
        isSorting = false;
        hidden_editor()
        updateModalButtons();
    } catch (error) {
        console.error('Ошибка при загрузке JSON файла:', error);
    }
}

// Очистка состояния модального окна
function clearModalState() {
    const sortableList = document.getElementById('sortable-list');
    while (sortableList.firstChild) {
        sortableList.removeChild(sortableList.firstChild);  // Полная очистка всех элементов
    }
    if (editor) {
        editor.session.setValue('');  // Очистка редактора
    }
    placeholder = null;  // Сбрасываем плейсхолдер
}

// Заполнение сортируемого списка
function fillSortableList(rules) {
    const sortableList = document.getElementById('sortable-list');
    sortableList.innerHTML = '';  // Очищаем список перед добавлением (убираем возможные дубликаты)

    rules.forEach((item, index) => {
        const div = createSortableItem(item, index);
        sortableList.appendChild(div);  // Добавляем элемент в DOM
    });
}

// Создание элемента для сортировки
function createSortableItem(rule, index) {
    const div = document.createElement('div');
    div.className = 'sortable-item';
    div.draggable = true;
    div.dataset.index = index;  // Присваиваем элементу индекс

    const expandedDiv = document.createElement('div');
    expandedDiv.classList.add('expanded');

    // Генерация информации о правиле
    const tagInfo = generateTagInfo(rule);
    expandedDiv.innerHTML = tagInfo.length > 100 ? tagInfo.substring(0, 228) + '...' : tagInfo;

    // Добавляем событие на сворачивание/разворачивание
    expandedDiv.classList.add('collapsed');
    expandedDiv.addEventListener('click', () => toggleExpanded(expandedDiv, rule));

    div.appendChild(expandedDiv);

    return div;
}

// Генерация информации о правиле
function generateTagInfo(rule) {
    let tagInfo = `Tag: <span style="color: #0098d9;">${rule.outboundTag || 'N/A'}</span>`;
    if (rule.domain) tagInfo += `<br><span style="color: #0098d9;">${rule.domain.join('<br>')}</span>`;
    if (rule.port) tagInfo += `<br>Port: <span style="color: #0098d9;">${rule.port}</span>`;
    if (rule.network) tagInfo += `<br>Network: <span style="color: #0098d9;">${rule.network}</span>`;
    if (rule.protocol) tagInfo += `<br>Protocol: <span style="color: #0098d9;">${rule.protocol.join('<br>')}</span>`;
    return tagInfo;
}

// Сворачивание/разворачивание элемента
function toggleExpanded(expandedDiv, rule) {
    const tagInfo = generateTagInfo(rule);
    if (expandedDiv.classList.contains('collapsed')) {
        expandedDiv.innerHTML = tagInfo;  // Раскрываем
        expandedDiv.classList.remove('collapsed');
    } else {
        expandedDiv.innerHTML = tagInfo.substring(0, 100) + '...';  // Скрываем
        expandedDiv.classList.add('collapsed');
    }
}

// Инициализация событий перетаскивания
function initializeDragAndDrop() {
    const sortableList = document.getElementById('sortable-list');
    let draggedItem = null;
    let draggedIndex = null;

    if (!placeholder) {
        placeholder = document.createElement('div');  // Создаем плейсхолдер один раз
        placeholder.className = 'placeholder';
    }

    sortableList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        draggedIndex = parseInt(draggedItem.dataset.index);
        setTimeout(() => draggedItem.style.display = 'none', 0);
    });

    sortableList.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedItem.style.display = 'block';
            draggedItem = null;
            draggedIndex = null;
            placeholder.remove();  // Удаляем плейсхолдер
            updateTempJsonOrder();  // Обновляем JSON порядок после перемещения
        }, 0);
    });

    sortableList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const target = e.target.closest('.sortable-item');
        if (target && target !== draggedItem) {
            const rect = target.getBoundingClientRect();
            const next = (e.clientY > rect.top + rect.height / 2) ? target.nextSibling : target;
            if (next && next !== placeholder) {
                sortableList.insertBefore(placeholder, next);
            }
        }
    });

    sortableList.addEventListener('drop', (e) => {
        e.preventDefault();
        if (placeholder && draggedItem) {
            sortableList.insertBefore(draggedItem, placeholder);
            placeholder.remove();  // Удаляем плейсхолдер после завершения
        }
    });
}

// Обновление порядка в tempJson после сортировки
function updateTempJsonOrder() {
    const sortableItems = Array.from(document.querySelectorAll('.sortable-item'));
    const newOrder = sortableItems.map(item => parseInt(item.dataset.index));

    tempJson.routing.rules = newOrder.map(index => tempJson.routing.rules[index]);  // Обновляем порядок правил
    editor.session.setValue(JSON.stringify(tempJson, null, 2));  // Обновляем JSON в редакторе
    editor.renderer.updateFull();  // Принудительное обновление отображения
}

// Переключение между режимами редактора и сортировки
function toggleSort() {
    if (!isSorting) {
        try {
            tempJson = JSON.parse(editor.session.getValue());
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            alert('Ошибка: Некорректный JSON.');
            return;
        }
    }

    isSorting = !isSorting;
    updateModalButtons();

    if (isSorting) {
        fillSortableList(tempJson.routing.rules);  // Переход в режим сортировки
        initializeDragAndDrop();
    }

    editor.renderer.updateFull();
}

// Обновление состояния кнопок модального окна
function updateModalButtons() {
    document.getElementById('edit-json').style.display = isSorting ? 'none' : 'block';
    document.getElementById('sort-json').style.display = isSorting ? 'block' : 'none';
    editor.container.style.display = isSorting ? 'none' : 'block';
    document.getElementById('sortable-list').style.display = isSorting ? 'block' : 'none';
}

// Сохранение JSON в файл
async function saveJsonToFile() {
    try {
        tempJson = JSON.parse(editor.session.getValue());
    } catch (error) {
        console.error('Ошибка при парсинге JSON:', error);
        alert('Ошибка: Некорректный JSON.');
        return;
    }

    try {
        await fetch(`/save_${currentFile}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tempJson, null, 2)
        });
        showModal(`Файл ${currentFile} успешно сохранен!`);
        clearTables();  // Очищаем таблицы перед обновлением
        populateTables();  // Обновляем данные в таблицах
        closeModal();
    } catch (error) {
        console.error('Ошибка при сохранении JSON файла:', error);
        showModal('Ошибка при сохранении.');
    }
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('jsonModal').style.display = 'none';
}

function hidden_editor() {
    // Получаем кнопки
    const inboundBtn = document.getElementById('inbound-btn');
    const outboundBtn = document.getElementById('outbound-btn');
    const routingBtn = document.getElementById('routing-btn');
    const editJsonBtn = document.getElementById('edit-json');

    // Функция для показа кнопки edit-json
    function showEditJson() {
        editJsonBtn.classList.remove('hidden_sort');
        editJsonBtn.classList.add('visible_sort');
    }

    // Функция для скрытия кнопки edit-json
    function hideEditJson() {
        editJsonBtn.classList.remove('visible_sort');
        editJsonBtn.classList.add('hidden_sort');
    }

    // Добавляем события на кнопки
    inboundBtn.addEventListener('click', hideEditJson);
    outboundBtn.addEventListener('click', hideEditJson);
    routingBtn.addEventListener('click', showEditJson);

}

// Привязка событий к кнопкам
document.getElementById('inbound-btn').addEventListener('click', () => openJsonModal('inbounds'));
document.getElementById('outbound-btn').addEventListener('click', () => openJsonModal('outbounds'));
document.getElementById('routing-btn').addEventListener('click', () => openJsonModal('routing'));
document.getElementById('save-json').addEventListener('click', saveJsonToFile);
document.getElementById('sort-json').addEventListener('click', toggleSort);
document.getElementById('edit-json').addEventListener('click', toggleSort);
document.getElementById('close-json').addEventListener('click', closeModal);

// Инициализация редактора при загрузке страницы
document.addEventListener("DOMContentLoaded", initAceEditor);

// Закрытие модального окна при клике вне его области
window.onclick = function (event) {
    const modal = document.getElementById('jsonModal');
    if (event.target === modal) {
        closeModal();
    }
};
