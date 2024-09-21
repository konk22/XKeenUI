// Функция для получения списка файлов .dat с сервера
async function fetchDatFiles() {
    const response = await fetch('/dat_files');
    const datFiles = await response.json();
    return datFiles;
}