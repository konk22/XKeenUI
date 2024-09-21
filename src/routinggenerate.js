// Функция для создания шаблонов для routing.json
function generateRoutingJSON() {
    let routingConfig = { "routing": { "rules": [] } };

    // Обработка чекбоксов для inboundTag
    const tproxyChecked = document.getElementById('radio2').checked;
    const redirectChecked = document.getElementById('radio3').checked;
    const mixedChecked = document.getElementById('radio1').checked;

    let inboundTags = [];
    if (mixedChecked) {
        inboundTags = ["redirect", "tproxy"];
    } else if (redirectChecked) {
        inboundTags.push("redirect");
    } else if (tproxyChecked) {
        inboundTags.push("tproxy");
    }

    // Обработка таблиц (пример для out_russia)
    const outRussiaTable = document.querySelector('.out_russia');
    processTable(outRussiaTable, "out-russia", routingConfig, inboundTags);

    const inRussiaTable = document.querySelector('.in_russia');
    processTable(inRussiaTable, "in-russia", routingConfig, inboundTags);

    const directTable = document.querySelector('.direct_table');
    processTable(directTable, "direct", routingConfig, inboundTags);

    const blockTable = document.querySelector('.block_table');
    processTable(blockTable, "block", routingConfig, inboundTags);

    const dnsTable = document.querySelector('.dns_table');
    processTable(dnsTable, "dns", routingConfig, inboundTags);

    return routingConfig;
}

// Функция для обработки строк таблицы (доменов, портов и протоколов)
function processTable(tableElement, outboundTag, routingConfig, inboundTags) {
    let domainTemplate = createDomainTemplate(outboundTag, inboundTags);
    let portTemplate = createPortTemplate(outboundTag, inboundTags);
    let portDnsTemplate = createPortDnsTemplate(outboundTag, inboundTags);
    let protocolTemplate = createProtocolTemplate(outboundTag, inboundTags);

    Array.from(tableElement.querySelectorAll('tr')).forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        const select = row.querySelector('select');
        const input = row.querySelector('input[type="text"]');
        const inputId = input ? input.id : null;
        // Проверяем, существует ли элемент checkbox, select и input
        if (checkbox && select && input) {
            const isChecked = checkbox.checked;
            const selectValue = select.value;
            const inputValue = input.value;
            // Обработка доменов
            if (selectValue.includes("null") || selectValue.includes("domain") || selectValue.includes("regexp") || selectValue.startsWith("ext:geosite")) {
                if (selectValue.includes("regexp")) {
                    domainValue = `${selectValue}${inputValue}$`;
                }
                else if (selectValue.includes("null")) {
                    domainValue = `${inputValue}`;
                } else {
                    domainValue = `${selectValue}:${inputValue}`;
                }
                if (isChecked) {
                    domainTemplate.domain.push(domainValue);
                } else {
                    domainTemplate.disabled_rules.push(domainValue);
                }
            }

            // Обработка портов
            if (selectValue === "TCP" || selectValue === "UDP") {
                const portValue = inputValue;

                // Создание отдельного шаблона для каждого типа протокола
                const portTemplate = {
                    inboundTag: inboundTags,
                    outboundTag: outboundTag,
                    type: "field",
                    network: selectValue,
                    port: portValue,
                    disabled_rules: []
                };

                if (isChecked) {
                    // Добавляем активный блок порта в routingConfig
                    routingConfig.routing.rules.push(portTemplate);
                } else {
                    // Добавляем в disabled_rules
                    portTemplate.disabled_rules.push({
                        network: selectValue,
                        port: portValue
                    });
                    routingConfig.routing.rules.push(portTemplate);
                }
            }
            if (selectValue === "TCP/UDP") {
                const portValue = inputValue;
                if (isChecked) {
                    portDnsTemplate.port = portValue;
                } else {
                    portDnsTemplate.disabled_rules.push({ port: portValue });
                }
            }
        }
        else if (checkbox && !select && input) {
            const isChecked = checkbox.checked;
            const inputValue = input.value;
            // Обработка протоколов
            if (isChecked) {
                protocolTemplate.protocol.push(inputValue);
            } else {
                protocolTemplate.disabled_rules.push(inputValue);
            }
        }
    });

    // Добавляем готовые шаблоны в конфиг, если они не пустые
    if (domainTemplate.domain.length > 0 || domainTemplate.disabled_rules.length > 0) {
        routingConfig.routing.rules.push(domainTemplate);
    }

    if (portTemplate.port || portTemplate.disabled_rules.length > 0) {
        routingConfig.routing.rules.push(portTemplate);
    }

    if (portDnsTemplate.port || portDnsTemplate.disabled_rules.length > 0) {
        routingConfig.routing.rules.push(portDnsTemplate);
    }

    if (protocolTemplate.protocol.length > 0 || protocolTemplate.disabled_rules.length > 0) {
        routingConfig.routing.rules.push(protocolTemplate);
    }
}

// Шаблон для доменов
function createDomainTemplate(outboundTag, inboundTags) {
    return {
        "inboundTag": inboundTags,
        "outboundTag": outboundTag,
        "type": "field",
        "domain": [],
        "disabled_rules": []
    };
}

// Шаблон для портов
function createPortTemplate(outboundTag, inboundTags) {
    return {
        "inboundTag": inboundTags,
        "outboundTag": outboundTag,
        "type": "field",
        "network": "",
        "port": "",
        "disabled_rules": []
    };
}

// Шаблон для портов
function createPortDnsTemplate(outboundTag, inboundTags) {
    return {
        "inboundTag": inboundTags,
        "outboundTag": outboundTag,
        "type": "field",
        "port": "",
        "disabled_rules": []
    };
}

// Шаблон для протоколов
function createProtocolTemplate(outboundTag, inboundTags) {
    return {
        "inboundTag": inboundTags,
        "outboundTag": outboundTag,
        "type": "field",
        "protocol": [],
        "disabled_rules": []
    };
}
