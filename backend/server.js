const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");


const app = express();

app.use(cors());
app.use(bodyParser.json());

const API_KEY = "some_key"; 

//  MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@1122",
  database: "metrics_db"
});

// Test DB Connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});


//  POST endpoint to receive system metrics

app.post("/api/metrics", (req, res) => {
  const data = req.body;

  //  API Key Check
  if (!data.api_key || data.api_key !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized or invalid API key." });
  }

  const sql = `
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.server_name || "",
    data.server_display_name || "",
    data.server_ip || "",
    data.cpu_usage || 0,
    data.ram_usage || 0,
    data.ram_total || 0,
    data.ram_used || 0,
    data.disk_usage || 0,
    data.disk_used || 0,
    data.disk_total || 0,
    data.uptime || "",
    data.os_name || "",
    data.os_version || "",
    data.kernel_version || "",
    data.ufw_status || "",
    data.ufw_open_ports || "",
    data.fail2ban_status || "",
    data.fail2ban_jails_enabled || "",
    data.total_processes || 0,
    data.running_processes || 0,
    data.established_connections || 0,
    data.last_reboot_time || "",
    data.disk_read_sectors || 0,
    data.disk_write_sectors || 0,
    data.logged_in_users || 0,
    new Date().toISOString()
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ error: "Failed to save metrics." });
    }
    res.status(200).json({ status: "ok", message: "Metrics saved successfully." });
  });
});

//  GET latest metrics for all servers
app.get("/api/metrics", (req, res) => {
  const sql = `
    SELECT * 
    FROM system_metrics 
    ORDER BY id DESC 
    LIMIT 50
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch metrics." });
    }
    res.json(results);
  });
});

//  GET latest metric by server IP
app.get("/api/metrics/:ip", (req, res) => {
  const serverIp = req.params.ip;

  const sql = `
    SELECT *
    FROM system_metrics
    WHERE server_ip = ?
    ORDER BY id DESC
    LIMIT 1
  `;

  db.query(sql, [serverIp], (err, results) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch server details." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Server not found." });
    }
    res.json(results[0]);
  });
});

app.get("/api/metrics/:ip/history", (req, res) => {
  const serverIp = req.params.ip;

  const sql = `
    SELECT *
    FROM system_metrics
    WHERE server_ip = ?
    ORDER BY id DESC
    LIMIT 100
  `;

  db.query(sql, [serverIp], (err, results) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch server history." });
    }
    res.json(results);
  });
});

app.post("/api/users", async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
      [name, username, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to create user" });
        }
        res.json({ message: "User created successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid username or password" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Invalid username or password" });

    res.json({ message: "Login successful" });
  });
});

app.get("/api/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

//  Delete user by ID
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
