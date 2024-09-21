// Функция для парсинга строки VLESS URL
function parseVlessUrl(vlessUrl) {
    const urlPattern = /vless:\/\/(?<id>[^@]+)@(?<address>[^:]+):(?<port>\d+)\?type=(?<network>[^&]+)&security=(?<security>[^&]+)&pbk=(?<publicKey>[^&]+)&fp=(?<fingerprint>[^&]+)&sni=(?<serverName>[^&]+)&sid=(?<shortId>[^&]+)&spx=(?<spiderX>[^&]+)&flow=(?<flow>[^#]+)/;

    const match = vlessUrl.match(urlPattern);
    if (!match || !match.groups) {
        return null; // Если строка не соответствует формату, вернем null
    }

    // Возвращаем объект с извлеченными параметрами
    return {
        id: match.groups.id,
        address: match.groups.address,
        port: parseInt(match.groups.port),
        network: match.groups.network,
        security: match.groups.security,
        publicKey: match.groups.publicKey,
        fingerprint: match.groups.fingerprint,
        serverName: match.groups.serverName,
        shortId: match.groups.shortId,
        spiderX: decodeURIComponent(match.groups.spiderX), // декодируем %2F
        flow: match.groups.flow
    };
}