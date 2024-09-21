// Функция для получения данных из 04_outbounds.json
async function fetchOutboundsData() {
    const response = await fetch('/outbounds');
    const outboundsData = await response.json();
    return outboundsData;
}

// Установка состояния чекбоксов на основе данных из 04_outbounds.json
async function setOutboundCheckboxState() {
    const outboundsData = await fetchOutboundsData();
    const vpsCheckbox = document.getElementById('vps2'); // 2 VPS
    const directCheckbox = document.getElementById('direct'); // Direct
    const blockCheckbox = document.getElementById('block'); // Block
    const dnsCheckbox = document.getElementById('dns'); // DNS

    // Собираем все теги из outbounds
    const tags = outboundsData.outbounds.map(outbound => outbound.tag);

    // Проверка на 2 VPS (два "out-russia")
    if (tags.includes("in-russia")) {
        vpsCheckbox.checked = true;
        vpsUrlField.style.display = 'block';
        inRussiaSection.style.display = 'block';
    }

    // Проверка на Block
    if (tags.includes("block")) {
        blockCheckbox.checked = true;
        blockSection.style.display = 'block';
    }

    // Проверка на Direct
    if (tags.includes("direct")) {
        directCheckbox.checked = true;
        directSection.style.display = 'block';
    }

    // Проверка на DNS
    if (tags.includes("dns")) {
        dnsCheckbox.checked = true;
        dnsSection.style.display = 'block';
    }
}