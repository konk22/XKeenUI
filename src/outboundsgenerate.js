// Функция для генерации JSON объекта и сохранения в файл
function generateOutboundsJSON() {
    // Получаем данные из текстовых полей
    const vlessInput = document.querySelector('.vless-input').value;
    const vpsInput = document.getElementById('vps-url').value;

    // Парсим строку vless://
    const vlessData = vlessInput ? parseVlessUrl(vlessInput) : null;
    const vpsData = vpsInput ? parseVlessUrl(vpsInput) : null;

    // Получаем состояние чекбоксов
    const vpsChecked = document.getElementById('vps2').checked;
    const directChecked = document.getElementById('direct').checked;
    const blockChecked = document.getElementById('block').checked;
    const dnsChecked = document.getElementById('dns').checked;

    // Создаем базовый JSON объект для outbounds
    let outboundConfig = { "outbounds": [] };

    // Если текстовое поле заполнено и распарсено, создаем блок "out-russia"
    if (vlessData) {
        outboundConfig.outbounds.push({
            "tag": "out-russia",
            "protocol": "vless",
            "settings": {
                "vnext": [{
                    "address": vlessData.address,
                    "port": vlessData.port,
                    "users": [{
                        "id": vlessData.id,
                        "encryption": "none", // Указываем зашифровку
                        "flow": vlessData.flow,
                        "level": 0
                    }]
                }]
            },
            "streamSettings": {
                "network": vlessData.network,
                "security": vlessData.security,
                "realitySettings": {
                    "publicKey": vlessData.publicKey,
                    "fingerprint": vlessData.fingerprint,
                    "serverName": vlessData.serverName,
                    "shortId": vlessData.shortId,
                    "spiderX": vlessData.spiderX
                }
            }
        });
    }

    // Если отмечен чекбокс "2 VPS", добавляем блок "in-russia"
    if (vpsChecked && vpsData) {
        outboundConfig.outbounds.push({
            "tag": "in-russia",
            "protocol": "vless",
            "settings": {
                "vnext": [{
                    "address": vpsData.address,
                    "port": vpsData.port,
                    "users": [{
                        "id": vpsData.id,
                        "encryption": "none", // Указываем зашифровку
                        "flow": vpsData.flow,
                        "level": 0
                    }]
                }]
            },
            "streamSettings": {
                "network": vpsData.network,
                "security": vpsData.security,
                "realitySettings": {
                    "publicKey": vpsData.publicKey,
                    "fingerprint": vpsData.fingerprint,
                    "serverName": vpsData.serverName,
                    "shortId": vpsData.shortId,
                    "spiderX": vpsData.spiderX
                }
            }
        });
    }

    // Если отмечен чекбокс "Direct", добавляем блок "direct"
    if (directChecked) {
        outboundConfig.outbounds.push({
            "tag": "direct",
            "protocol": "freedom"
        });
    }

    // Если отмечен чекбокс "Block", добавляем блок "block"
    if (blockChecked) {
        outboundConfig.outbounds.push({
            "tag": "block",
            "protocol": "blackhole",
            "settings": {
                "response": {
                    "type": "http"
                }
            }
        });
    }

    // Если отмечен чекбокс "DNS", добавляем блок "dns"
    if (dnsChecked) {
        outboundConfig.outbounds.push({
            "tag": "dns",
            "protocol": "dns"
        });
    }

    return outboundConfig;
}