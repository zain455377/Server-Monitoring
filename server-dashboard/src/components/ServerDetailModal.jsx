import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const ServerDetailModal = ({ server, onClose }) => {
  const [serverDetails, setServerDetails] = useState(server);

  useEffect(() => {
    
    fetch(`http://localhost:5000/api/metrics/${server.server_ip}`) 
      .then(res => res.json())
      .then(data => setServerDetails(data))
      .catch(() => setServerDetails(server));
  }, [server]);

  if (!serverDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 rounded-2xl shadow-lg text-white w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-white hover:text-red-200"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {serverDetails.server_display_name} - {serverDetails.server_ip}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p><span className="font-semibold">CPU Usage:</span> {serverDetails.cpu_usage}%</p>
            <p><span className="font-semibold">RAM Usage:</span> {serverDetails.ram_usage}%</p>
            <p><span className="font-semibold">Disk Usage:</span> {serverDetails.disk_usage}% ({serverDetails.disk_used}GB / {serverDetails.disk_total}GB)</p>
            <p><span className="font-semibold">Uptime:</span> {serverDetails.uptime} sec</p>
            <p><span className="font-semibold">Last Update:</span> {serverDetails.last_reboot_time}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-semibold">OS Name:</span> {serverDetails.os_name}</p>
            <p><span className="font-semibold">OS Version:</span> {serverDetails.os_version}</p>
            <p><span className="font-semibold">Last Reboot:</span> {serverDetails.last_reboot_time}</p>
            <p><span className="font-semibold">Kernel Version:</span> {serverDetails.kernel_version}</p>
            <p><span className="font-semibold">UFW Status:</span> {serverDetails.ufw_status}</p>
            <p><span className="font-semibold">UFW Open Ports:</span> {serverDetails.ufw_open_ports}</p>
            <p><span className="font-semibold">Fail2ban Status:</span> {serverDetails.fail2ban_status}</p>
            <p><span className="font-semibold">Fail2ban Jails:</span> {serverDetails.fail2ban_jails_enabled}</p>
            <p><span className="font-semibold">Established Connections:</span> {serverDetails.established_connections}</p>
            <p><span className="font-semibold">Total Processes:</span> {serverDetails.total_processes}</p>
            <p><span className="font-semibold">Running Processes:</span> {serverDetails.running_processes}</p>
            <p><span className="font-semibold">Disk Read:</span> {serverDetails.disk_read_sectors}</p>
            <p><span className="font-semibold">Disk Write:</span> {serverDetails.disk_write_sectors}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerDetailModal;