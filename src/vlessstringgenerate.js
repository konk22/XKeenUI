// Функция для формирования строки VLESS и помещения ее в текстовое поле
function generateVlessString(outbound) {
    const user = outbound.settings.vnext[0].users[0];
    const streamSettings = outbound.streamSettings;
    const realitySettings = streamSettings.realitySettings;

    const vlessString = `vless://${user.id}@${outbound.settings.vnext[0].address}:${outbound.settings.vnext[0].port}`
        + `?type=${streamSettings.network}&security=${streamSettings.security}`
        + `&pbk=${realitySettings.publicKey}&fp=${realitySettings.fingerprint}`
        + `&sni=${realitySettings.serverName}&sid=${realitySettings.shortId}`
        + `&spx=${encodeURIComponent(realitySettings.spiderX)}`
        + `&flow=${user.flow}`;

    return vlessString;
}