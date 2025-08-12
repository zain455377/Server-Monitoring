import psutil
import platform
import socket
import json
import requests
import time
import datetime
import subprocess
import mysql.connector
from datetime import datetime

API_URL = "https://servers.canadatel.net/api/submit.php"
API_KEY = "some_key"
SERVER_ID = "LN001"
SERVER_DISPLAY_NAME = "Linux-Server-1"
SERVER_IP = requests.get('https://api.ipify.org').text  # Public IP

# CPU Usage
CPU_USAGE = round(psutil.cpu_percent(interval=1), 2)

# RAM Usage
virtual_mem = psutil.virtual_memory()
RAM_USAGE = round(virtual_mem.percent, 2)
RAM_TOTAL = round(virtual_mem.total / (1024**3), 2)
RAM_USED = round((virtual_mem.total - virtual_mem.available) / (1024**3), 2)

# Disk Usage
partitions = psutil.disk_partitions()
total_disk = used_disk = 0
for p in partitions:
    if p.fstype == '':
        continue
    usage = psutil.disk_usage(p.mountpoint)
    total_disk += usage.total
    used_disk += usage.used

if total_disk > 0:
    DISK_USAGE = round((used_disk / total_disk) * 100, 2)
    DISK_TOTAL = round(total_disk / (1024**3), 2)
    DISK_USED = round(used_disk / (1024**3), 2)
else:
    DISK_USAGE = DISK_TOTAL = DISK_USED = "N/A"

# Uptime
boot_time = psutil.boot_time()
uptime_sec = round(time.time() - boot_time, 0)

# OS Details
OS_NAME = platform.system() + " " + platform.release()
OS_VERSION = platform.version()
KERNEL_VERSION = platform.release()

# Firewall Status (UFW)
try:
    status_output = subprocess.check_output(['ufw', 'status'], stderr=subprocess.DEVNULL).decode()
    UFW_STATUS = "active" if "Status: active" in status_output else "inactive"
except:
    UFW_STATUS = "unknown"

# Open Ports (UFW)
try:
    ports_output = subprocess.check_output(['ss', '-tuln'], stderr=subprocess.DEVNULL).decode()
    ports = sorted(set([line.split()[4].split(":")[-1] for line in ports_output.splitlines()[1:] if ":" in line]))
    UFW_OPEN_PORTS = ','.join(ports) if ports else "None"
except:
    UFW_OPEN_PORTS = "unknown"

# Fail2Ban Status
try:
    fail2ban_status = subprocess.check_output(['fail2ban-client', 'status'], stderr=subprocess.DEVNULL).decode()
    FAIL2BAN_STATUS = "active" if "Status" in fail2ban_status else "inactive"
    jail_lines = [line for line in fail2ban_status.splitlines() if "Jail list:" in line]
    FAIL2BAN_JAILS_ENABLED = jail_lines[0].split(":", 1)[1].strip() if jail_lines else "None"
except:
    FAIL2BAN_STATUS = FAIL2BAN_JAILS_ENABLED = "unknown"

# Processes
TOTAL_PROCESSES = len(psutil.pids())
RUNNING_PROCESSES = len([p.info for p in psutil.process_iter(attrs=['status']) if p.info['status'] == psutil.STATUS_RUNNING])

# Network Connections
ESTABLISHED_CONNECTIONS = len([conn for conn in psutil.net_connections(kind='tcp') if conn.status == 'ESTABLISHED'])

# Last Reboot Time
LAST_REBOOT_TIME = datetime.fromtimestamp(boot_time).strftime("%Y-%m-%d %H:%M:%S")

# Disk IO
disk_io = psutil.disk_io_counters()
DISK_READ_SECTORS = round(disk_io.read_bytes / 512)
DISK_WRITE_SECTORS = round(disk_io.write_bytes / 512)

# Logged-in Users
try:
    logged_users = psutil.users()
    LOGGED_IN_USERS = len([u for u in logged_users if u.name != ''])
except:
    LOGGED_IN_USERS = "N/A"

# Payload
payload = {
    "api_key": API_KEY,
    "server_name": SERVER_ID,
    "server_display_name": SERVER_DISPLAY_NAME,
    "server_ip": SERVER_IP,
    "cpu_usage": CPU_USAGE,
    "ram_usage": RAM_USAGE,
    "ram_total": RAM_TOTAL,
    "ram_used": RAM_USED,
    "disk_usage": DISK_USAGE,
    "disk_used": DISK_USED,
    "disk_total": DISK_TOTAL,
    "uptime": uptime_sec,
    "os_name": OS_NAME,
    "os_version": OS_VERSION,
    "kernel_version": KERNEL_VERSION,
    "ufw_status": UFW_STATUS,
    "ufw_open_ports": UFW_OPEN_PORTS,
    "fail2ban_status": FAIL2BAN_STATUS,
    "fail2ban_jails_enabled": FAIL2BAN_JAILS_ENABLED,
    "total_processes": TOTAL_PROCESSES,
    "running_processes": RUNNING_PROCESSES,
    "established_connections": ESTABLISHED_CONNECTIONS,
    "last_reboot_time": LAST_REBOOT_TIME,
    "disk_read_sectors": DISK_READ_SECTORS,
    "disk_write_sectors": DISK_WRITE_SECTORS,
    "logged_in_users": LOGGED_IN_USERS
}

# Send to API
try:
    response = requests.post(API_URL, json=payload)
    print("Metrics sent successfully. Response:", response.text)
except Exception as e:
    print("Failed to send metrics:", str(e))

# --- Database Config ---
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "Admin@1122",
    "database": "metrics_db"
}

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    insert_query = """
    INSERT INTO system_metrics (
        server_name, server_display_name, server_ip,
        cpu_usage, ram_usage, ram_total, ram_used,
        disk_usage, disk_used, disk_total, uptime,
        os_name, os_version, kernel_version,
        ufw_status, ufw_open_ports,
        fail2ban_status, fail2ban_jails_enabled,
        total_processes, running_processes,
        established_connections, last_reboot_time,
        disk_read_sectors, disk_write_sectors,
        logged_in_users, created_at
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        payload["server_name"],
        payload["server_display_name"],
        payload["server_ip"],
        payload["cpu_usage"],
        payload["ram_usage"],
        payload["ram_total"],
        payload["ram_used"],
        payload["disk_usage"],
        payload["disk_used"],
        payload["disk_total"],
        payload["uptime"],
        payload["os_name"],
        payload["os_version"],
        payload["kernel_version"],
        payload["ufw_status"],
        payload["ufw_open_ports"],
        payload["fail2ban_status"],
        payload["fail2ban_jails_enabled"],
        payload["total_processes"],
        payload["running_processes"],
        payload["established_connections"],
        payload["last_reboot_time"],
        payload["disk_read_sectors"],
        payload["disk_write_sectors"],
        payload["logged_in_users"],
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    cursor.execute(insert_query, values)
    conn.commit()
    print("✅ Metrics inserted into database successfully.")

except mysql.connector.Error as err:
    print("❌ Database error:", err)

finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()
