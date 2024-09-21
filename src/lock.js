const lockToggleCheckbox = document.getElementById('lockToggle');
const saveLockField = document.getElementById('saveLock');
const inboundBtn = document.getElementById('inbound-btn');
const outboundBtn = document.getElementById('outbound-btn');
const buttonGroup = document.querySelector('.button-group');

// При загрузке страницы кнопки уже скрыты
inboundBtn.classList.add('hidden');
outboundBtn.classList.add('hidden');

lockToggleCheckbox.addEventListener('change', () => {
    if (lockToggleCheckbox.checked) {
        saveLockField.style.display = 'block';
        inboundBtn.classList.remove('hidden');
        outboundBtn.classList.remove('hidden');
    } else {
        saveLockField.style.display = 'none';
        inboundBtn.classList.add('hidden');
        outboundBtn.classList.add('hidden');
    }

    // Центрирование оставшейся кнопки, если другие скрыты
    if (!lockToggleCheckbox.checked) {
        buttonGroup.style.justifyContent = 'center';
    } else {
        buttonGroup.style.justifyContent = 'flex-start';
    }
});