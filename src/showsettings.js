// Логика для отображения текстового поля и таблиц для URL VPS, Direct, Block, DNS
const vpsCheckbox = document.getElementById('vps2');
const directCheckbox = document.getElementById('direct');
const blockCheckbox = document.getElementById('block');
const dnsCheckbox = document.getElementById('dns');

const vpsUrlField = document.getElementById('vps-url');
const inRussiaSection = document.getElementById('in-russia');
const directSection = document.getElementById('direct-section');
const blockSection = document.getElementById('block-section');
const dnsSection = document.getElementById('dns-section');

vpsCheckbox.addEventListener('change', () => {
    if (vpsCheckbox.checked) {
        vpsUrlField.style.display = 'block';
        inRussiaSection.style.display = 'block';
    } else {
        vpsUrlField.style.display = 'none';
        inRussiaSection.style.display = 'none';
    }
});

directCheckbox.addEventListener('change', () => {
    directSection.style.display = directCheckbox.checked ? 'block' : 'none';
});

blockCheckbox.addEventListener('change', () => {
    blockSection.style.display = blockCheckbox.checked ? 'block' : 'none';
});

dnsCheckbox.addEventListener('change', () => {
    dnsSection.style.display = dnsCheckbox.checked ? 'block' : 'none';
});