# Server Dashboard

A web-based server dashboard application with a Node.js backend and React frontend.

## Requirements
- Node.js (v14 or above recommended)
- MySQL Database

---

## 1. Database Setup (MySQL Initialization)

1. Open MySQL in your terminal or any MySQL client.
2. Create a new database:
   ```sql
   CREATE DATABASE metrics_db;
3.   CREATE TABLE IF NOT EXISTS system_metrics 
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_name VARCHAR(100),
  server_display_name VARCHAR(100),
  server_ip VARCHAR(45),
  cpu_usage FLOAT,
  ram_usage FLOAT,
  ram_total FLOAT,
  ram_used FLOAT,
  disk_usage FLOAT,
  disk_used FLOAT,
  disk_total FLOAT,
  uptime BIGINT,
  os_name VARCHAR(100),
  os_version VARCHAR(100),
  kernel_version VARCHAR(100),
  ufw_status VARCHAR(50),
  ufw_open_ports TEXT,
  fail2ban_status VARCHAR(50),
  fail2ban_jails_enabled TEXT,
  total_processes INT,
  running_processes INT,
  established_connections INT,
  last_reboot_time VARCHAR(50),
  disk_read_sectors BIGINT,
  disk_write_sectors BIGINT,
  logged_in_users INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

## 2.Navigate to backend folder
1. cd backend  
2. npm install
3. npm start

## 3.Navigate to frontend folder
1. cd server-dashboard
2. npm install
3. npm start
