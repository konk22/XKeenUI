const toggle = document.getElementById('modeToggle');
const body = document.body;

// Функция для применения темы
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggle.checked = false;
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme('light');
}

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    }
});