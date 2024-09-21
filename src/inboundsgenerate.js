// Функция для создания JSON для inbounds
function generateInboundsJSON() {
    const inbounds = [];
    const mixedChecked = document.getElementById('radio1').checked;
    const tproxyChecked = document.getElementById('radio2').checked;
    const redirectChecked = document.getElementById('radio3').checked;

    if (mixedChecked) {
        inbounds.push({
            "tag": "redirect",
            "port": 61219,
            "protocol": "dokodemo-door",
            "settings": { "network": "tcp", "followRedirect": true },
            "sniffing": { "routeOnly": true, "enabled": true, "destOverride": ["http", "tls", "quic"] }
        });
        inbounds.push({
            "tag": "tproxy",
            "port": 61219,
            "protocol": "dokodemo-door",
            "settings": { "network": "udp", "followRedirect": true },
            "streamSettings": { "sockopt": { "tproxy": "tproxy" } },
            "sniffing": { "routeOnly": true, "enabled": true, "destOverride": ["http", "tls", "quic"] }
        });
    } else if (tproxyChecked) {
        inbounds.push({
            "tag": "tproxy",
            "port": 61219,
            "protocol": "dokodemo-door",
            "settings": { "network": "udp", "followRedirect": true },
            "streamSettings": { "sockopt": { "tproxy": "tproxy" } },
            "sniffing": { "routeOnly": true, "enabled": true, "destOverride": ["http", "tls", "quic"] }
        });
    } else if (redirectChecked) {
        inbounds.push({
            "tag": "redirect",
            "port": 61219,
            "protocol": "dokodemo-door",
            "settings": { "network": "tcp", "followRedirect": true },
            "sniffing": { "routeOnly": true, "enabled": true, "destOverride": ["http", "tls", "quic"] }
        });
    }

    return { "inbounds": inbounds };
}