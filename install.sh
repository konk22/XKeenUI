#!/opt/bin/sh

# Переменные директорий
BASE_DIR="/opt/etc/xray/xkeenui"
SRC_DIR="$BASE_DIR/src"

# Создание директорий
mkdir -p "$BASE_DIR"
mkdir -p "$SRC_DIR"

# Загрузка файлов в /opt/etc/xray/xkeenui (включая script.py)
curl -o "$BASE_DIR/index.html" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/index.html"
curl -o "$BASE_DIR/main.py" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/main.py"
curl -o "$BASE_DIR/styles.css" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/styles.css"

# Загрузка файлов в /opt/etc/xray/xkeenui/src
curl -o "$SRC_DIR/ace.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/ace.js"
curl -o "$SRC_DIR/adddomain.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/adddomain.js"
curl -o "$SRC_DIR/addport.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/addport.js"
curl -o "$SRC_DIR/addprotocol.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/addprotocol.js"
curl -o "$SRC_DIR/checkstatus.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/checkstatus.js"
curl -o "$SRC_DIR/cleartable.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/cleartable.js"
curl -o "$SRC_DIR/datgetting.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/datgetting.js"
curl -o "$SRC_DIR/favicon.ico" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/favicon.ico"
curl -o "$SRC_DIR/inboundsgenerate.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/inboundsgenerate.js"
curl -o "$SRC_DIR/inboundsgetting.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/inboundsgetting.js"
curl -o "$SRC_DIR/lock.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/lock.js"
curl -o "$SRC_DIR/modaleditor.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/modaleditor.js"
curl -o "$SRC_DIR/modalmessage.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/modalmessage.js"
curl -o "$SRC_DIR/mode-json.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/mode-json.js"
curl -o "$SRC_DIR/onloads.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/onloads.js"
curl -o "$SRC_DIR/outboundgetting.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/outboundgetting.js"
curl -o "$SRC_DIR/outboundsgenerate.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/outboundsgenerate.js"
curl -o "$SRC_DIR/restart.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/restart.js"
curl -o "$SRC_DIR/restoreconfig.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/restoreconfig.js"
curl -o "$SRC_DIR/routinggenerate.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/routinggenerate.js"
curl -o "$SRC_DIR/routinggetting.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/routinggetting.js"
curl -o "$SRC_DIR/savedata.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/savedata.js"
curl -o "$SRC_DIR/showsettings.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/showsettings.js"
curl -o "$SRC_DIR/stop.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/stop.js"
curl -o "$SRC_DIR/tabspoiler.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/tabspoiler.js"
curl -o "$SRC_DIR/theme-github.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/theme-github.js"
curl -o "$SRC_DIR/theme.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/theme.js"
curl -o "$SRC_DIR/vlessstringgenerate.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/vlessstringgenerate.js"
curl -o "$SRC_DIR/vlessstringparser.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/vlessstringparser.js"
curl -o "$SRC_DIR/vlessstringput.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/vlessstringput.js"
curl -o "$SRC_DIR/worker-json.js" "https://github.com/konk22/XKeenUI/raw/refs/heads/main/src/worker-json.js"

# Создание службы для Entware
SERVICE_FILE="/opt/etc/init.d/S99xkeenui"

echo "#!/opt/bin/sh

ENABLED=yes
PROCS=python3
ARGS='/opt/etc/xray/xkeenui/main.py'
PREARGS=''
DESC='XKeen UI'
PATH=/opt/sbin:/opt/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

. /opt/etc/init.d/rc.func" > $SERVICE_FILE

# Делаем скрипт исполняемым
chmod +x $SERVICE_FILE

# Запуск службы
$SERVICE_FILE start
