import http.server
import socketserver
import threading
import os
import re
import json
import subprocess
import shutil
from datetime import datetime

# Define the port to serve the page
PORT = 8088

JSON_DIR = '/opt/etc/xray/configs'
DAT_DIR = '/opt/etc/xray/dat'
BAK_DIR = '/opt/etc/xray/configs/old'
JOB_DIR = '/opt/etc/xray/xkeenui'

# Получение списка .dat файлов
def get_dat_files(DAT_DIR):
    if not os.path.exists(DAT_DIR):
        return []
    return [f for f in os.listdir(DAT_DIR) if f.endswith('.dat')]

# Удаление комментариев из JSON файла
def remove_json_comments(file_content):
    return re.sub(r'//.*', '', file_content)

# Удаление ANSI кодов из текста
def remove_ansi_codes(text):
    ansi_escape = re.compile(r'\x1B[@-_][0-?]*[ -/]*[@-~]')
    return ansi_escape.sub('', text)

# Чтение JSON файла с проверкой ошибок
def read_json_file(file_path):
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                raw_content = f.read()
                filtered_content = remove_json_comments(raw_content)
                return json.loads(filtered_content)
        return {}
    except Exception as e:
        print(f"Ошибка при чтении файла {file_path}: {str(e)}")
        return {}

# Резервное копирование файла
def backup_file(filename):
    if not os.path.exists(BAK_DIR):
        os.makedirs(BAK_DIR)

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = os.path.join(BAK_DIR, f'{filename}_{timestamp}.bak')

    file_path = os.path.join(JSON_DIR, filename)
    if os.path.exists(file_path):
        shutil.copy(file_path, backup_filename)

# Восстановление последнего бэкапа
def restore_last_backup(filename):
    backups = os.listdir(BAK_DIR)
    matching_backups = [f for f in backups if f.startswith(filename) and f.endswith('.bak')]
    
    if not matching_backups:
        print(f'Backup file not found for: {filename} in {BAK_DIR}')
        return False

    matching_backups.sort(reverse=True)
    last_backup = matching_backups[0]

    print(f'Restoring {filename} from {last_backup}')
    shutil.copy(os.path.join(BAK_DIR, last_backup), os.path.join(JSON_DIR, filename))
    return True

# Обработчик запросов
class MyRequestHandler(http.server.SimpleHTTPRequestHandler):

    def handle_json_response(self, json_file):
        json_data = read_json_file(os.path.join(JSON_DIR, json_file))
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(json_data).encode())

    def do_GET(self):
        if self.path == '/dat_files':
            dat_files = get_dat_files(DAT_DIR)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(dat_files).encode())
        elif self.path == '/inbounds':
            self.handle_json_response('03_inbounds.json')
        elif self.path == '/outbounds':
            self.handle_json_response('04_outbounds.json')
        elif self.path == '/routing':
            self.handle_json_response('05_routing.json')
        elif self.path == '/check_status':
            try:
                result = subprocess.run(['xkeen', '-status'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                output = result.stdout.decode('utf-8').strip()
                cleaned_output = remove_ansi_codes(output)
                status = {"status": "running" if "Прокси-клиент запущен" in cleaned_output else "stopped"}

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(status).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()

        elif self.path == '/restart':
            try:
                def restart_service():
                    try:
                        # Используем Popen для асинхронного выполнения команды
                        process = subprocess.Popen(['xkeen', '-restart'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                        
                        # Чтение вывода процесса
                        output, error = process.communicate()

                        # Обработка результата выполнения
                        if process.returncode == 0:
                            output_message = output.decode('utf-8').strip()
                            print(f"Restart output: {output_message}")
                        else:
                            error_message = error.decode('utf-8').strip()
                            print(f"Error: {error_message}")
                    except Exception as e:
                        print(f"Exception during restart: {str(e)}")

                # Запуск перезапуска службы в отдельном потоке, чтобы избежать блокировки
                restart_thread = threading.Thread(target=restart_service)
                restart_thread.start()

                # Возвращаем ответ сразу после запуска команды
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Restarting service...")

            except Exception as e:
                print(f"Exception during restart: {str(e)}")
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error restarting service: {str(e)}".encode())

        elif self.path == '/stop':
            try:
                def stop_service():
                    process = subprocess.Popen(['xkeen', '-stop'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                    output, error = process.communicate()
                    output_message = output.decode('utf-8').strip()

                    if process.returncode != 0:
                        error_message = error.decode('utf-8').strip()
                        print(f"Error: {error_message}")
                    else:
                        print(f"Stop output: {output_message}")

                stop_thread = threading.Thread(target=stop_service)
                stop_thread.start()

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Stopping service...")
            except Exception as e:
                print(f"Exception during stop: {str(e)}")
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error stopping service: {str(e)}".encode())
        else:
            if self.path == '/':
                self.path = 'index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        if self.path == '/save_inbounds':
            inbounds_data = json.loads(post_data)
            backup_file('03_inbounds.json')
            with open(os.path.join(JSON_DIR, '03_inbounds.json'), 'w') as f:
                json.dump(inbounds_data, f, indent=2)

            self.send_response(200)
            self.end_headers()

        elif self.path == '/save_outbounds':
            outbounds_data = json.loads(post_data)
            backup_file('04_outbounds.json')
            with open(os.path.join(JSON_DIR, '04_outbounds.json'), 'w') as f:
                json.dump(outbounds_data, f, indent=2)

            self.send_response(200)
            self.end_headers()

        elif self.path == '/save_routing':
            routing_data = json.loads(post_data)
            backup_file('05_routing.json')
            with open(os.path.join(JSON_DIR, '05_routing.json'), 'w') as f:
                json.dump(routing_data, f, indent=4)

            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'Success')

        elif self.path == '/restore':
            success_inbounds = restore_last_backup('03_inbounds.json')
            success_outbounds = restore_last_backup('04_outbounds.json')
            success_routing = restore_last_backup('05_routing.json')

            if success_inbounds or success_outbounds or success_routing:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'Backup restored successfully')
            else:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(b'No backups found to restore')

        else:
            self.send_response(501)
            self.end_headers()

# Запуск сервера
def run_server():
    os.chdir(JOB_DIR)
    with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
        print(f"Serving at port {PORT}")
        
        server_thread = threading.Thread(target=httpd.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        
        try:
            while server_thread.is_alive():
                server_thread.join(1)
        except KeyboardInterrupt:
            print("Stopping server...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
