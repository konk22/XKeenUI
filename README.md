# XKeenUI — Веб-интерфейс для конфигурирования XKeen

**XKeenUI** — это минималистичное веб-приложение для управления конфигурацией XKeen. Этот проект предлагает удобный способ настройки файлов `inbounds`, `outbounds`, `routs`. XKeenUI также позволяет контролировать работу самой службы и предоставляет ряд дополнительных возможностей для управления сервисом.

## Основные возможности

### 1. Интерактивное управление конфигурацией
XKeenUI упрощает процесс настройки конфигурационных файлов:
- **Файлы `inbounds`, `outbounds` и `routs`** могут быть изменены прямо через веб-интерфейс, без необходимости работы с консолью.

### 2. Управление службой XKeen
Из интерфейса можно:
- Перезапускать службу XKeen для применения изменений.
- Останавливать службу при необходимости для выполнения различных задач или диагностики.
- Так же имеется индикатор состояния сервиса Xkeen.

### 3. Встроенные редакторы
- **Текстовый редактор JSON**: для ручного редактирования конфигурационных файлов.
- **Редактор последовательности блоков**: упрощает управление блоками `outbounds` в файле `routs`, позволяя легко менять их порядок.

### 4. Резервное копирование конфигураций
Каждое сохранение конфигурации сопровождается автоматическим созданием резервной копии предыдущей версии, что позволяет быстро откатиться на прежнюю конфигурацию, если что-то пошло не так.

### 5. Гибкое управление правилами
XKeenUI поддерживает функцию временного отключения правил. Для реализации этой возможности, в файл `routs` был добавлен ключ `disabled_rules`.

### 6. Поддержка протокола VLESS
На данный момент проект полностью поддерживает работу с протоколом **VLESS**.

---

## Установка

Для установки XKeenUI выполните следующую команду в вашем терминале:

```
curl -O https://raw.githubusercontent.com/konk22/XKeenUI/refs/heads/main/install.sh && chmod +x install.sh && ./install.sh
```


После выполнения скрипта интерфейс будет доступен на порте 8088.

---

## Рекомендации по настройке

1. Если вы используете конфигурации из официальной документации XKeen, представленной на [XKeen Documentation](https://xskrill.notion.site/XKeen-c9f0f2a5018743b59eb81bd6fccdf25a), все параметры будут автоматически заполнены корректно.
2. В связи с отсутствием строгого стандарта для значений ключа `outboundTag`, после первого запуска рекомендуется:
    - Удалить файлы `03_inbounds.json`, `04_outbounds.json`, `05_routs.json`.
    - Либо привести значения этих ключей к типам, представленным в документации.

---

## Примеры интерфейса
![image](https://github.com/user-attachments/assets/9ddadb8b-b435-452a-a7ad-c859b1feb69d)

![image](https://github.com/user-attachments/assets/975888d7-2c2a-474d-8f0b-98abf8b6b686)



---

Не стесняйтесь создавать **issue** или предлагать **pull requests**!
