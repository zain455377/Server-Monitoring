import React from 'react';
import { useNavigate } from 'react-router-dom';
import WindowsIcon from "../components/WindowsIcon";

const getUsageColor = (value) => {
  if (value >= 80) return 'bg-red-500';
  if (value >= 60) return 'bg-yellow-400';
  return 'bg-green-500';
};

const getOSIcon = (os_name) => {
  if (os_name?.toLowerCase().includes("linux")) return "🐧";
  return <WindowsIcon size={20} className="inline-block" />;
};

const ServerCard = ({ server, onClick }) => {
  const navigate = useNavigate();

  if (!server) return null;

  const {
    server_display_name,
    server_name,
    cpu_usage,
    ram_usage,
    disk_usage,
    disk_used,
    disk_total,
    server_ip,
    uptime,
    last_reboot_time,
    os_name,
  } = server;

  const alerts = [];
if (cpu_usage >= 80) alerts.push("High CPU Usage");
if (ram_usage >= 80) alerts.push("High RAM Usage");
if (disk_usage >= 80) alerts.push("High Disk Usage");

  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="rounded-2xl shadow-lg bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 text-white p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getOSIcon(os_name)}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{server_display_name}</h2>
              <p><span className="text-sm italic text-white/70">ID:</span> {server_name}</p>
            </div>
          </div>
          {alerts.length > 0 && (
  <div className="group relative">
    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold cursor-pointer">
      Alert
    </div>
    <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-black text-white px-2 py-1 rounded shadow-md mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
      {alerts.join(", ")}
    </div>
  </div>
)}
        </div>

        {/* CPU */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-semibold">
            <span>CPU Usage:</span>
            <span>{cpu_usage}%</span>
          </div>
          <div className="w-full h-3 bg-white/30 rounded-full mt-1">
            <div
              className={`h-3 rounded-full ${getUsageColor(cpu_usage)}`}
              style={{ width: `${cpu_usage}%` }}
            />
          </div>
        </div>

        {/* RAM */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-semibold">
            <span>RAM Usage:</span>
            <span>{ram_usage}%</span>
          </div>
          <div className="w-full h-3 bg-white/30 rounded-full mt-1">
            <div
              className={`h-3 rounded-full ${getUsageColor(ram_usage)}`}
              style={{ width: `${ram_usage}%` }}
            />
          </div>
          <p className="text-xs text-white/70 mt-1">
            {(ram_usage / 100 * 16).toFixed(1)}GB / 16GB
          </p>
        </div>

        {/* Disk */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-semibold">
            <span>Disk Usage:</span>
            <span>{disk_usage}%</span>
          </div>
          <div className="w-full h-3 bg-white/30 rounded-full mt-1">
            <div
              className={`h-3 rounded-full ${getUsageColor(disk_usage)}`}
              style={{ width: `${disk_usage}%` }}
            />
          </div>
          <p className="text-xs text-white/70 mt-1">
            {disk_used}GB / {disk_total}GB
          </p>
        </div>

        {/* Uptime & Last Update */}
        <div className="text-sm mt-4 space-y-1 text-white">
          <p><span className="font-semibold">IP:</span> {server_ip}</p>
          <p><span className="font-semibold">Uptime:</span> {uptime}</p>
          <p><span className="font-semibold">Last Update:</span> {last_reboot_time}</p>
        </div>

        {/* History Button */}
        <div className="flex justify-end mt-6">
          <button onClick={(e) => {
          e.stopPropagation();
         navigate(`/history/${encodeURIComponent(server_ip)}`,{ state: { server } }
          );
         }}
  className="bg-red-500 text-white px-6 py-1.5 rounded-full font-semibold hover:brightness-110 transition duration-200"
>
  History
</button>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;