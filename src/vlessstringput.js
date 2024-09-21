// Установка VLESS строки в текстовое поле
async function setVlessInputField() {
    const outboundsData = await fetchOutboundsData();
    const vlessInputField = document.querySelector('.vless-input');

    // Найдем объект с тегом "out-russia"
    const outboundRussia = outboundsData.outbounds.find(outbound => outbound.tag === "out-russia");

    if (outboundRussia) {
        const vlessString = generateVlessString(outboundRussia);
        vlessInputField.value = vlessString;  // Помещаем строку в текстовое поле
    }
}

// Установка VLESS строки во второе текстовое поле для "in-russia"
async function setVlessInputFieldForInRussia() {
    const outboundsData = await fetchOutboundsData();
    const vpsUrlField = document.getElementById('vps-url');  // Второе текстовое поле

    // Найдем объект с тегом "in-russia"
    const inboundRussia = outboundsData.outbounds.find(outbound => outbound.tag === "in-russia");

    if (inboundRussia) {
        const vlessString = generateVlessString(inboundRussia);
        vpsUrlField.value = vlessString;  // Помещаем строку во второе текстовое поле
    }
}