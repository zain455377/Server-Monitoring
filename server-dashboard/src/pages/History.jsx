import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const History = () => {
  const { server_ip } = useParams();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    
    fetch(`http://localhost:5000/api/metrics/${server_ip}/history`) 
      .then(res => res.json())
      .then(data => setHistoryData(data))
      .catch(err => console.error('Error fetching history:', err));
  }, [server_ip]);

  return (
    <div className="p-4 min-h-screen bg-dashboardBg text-white">
      <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 rounded-xl shadow-lg p-6 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <XAxis dataKey="last_reboot_time" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: '#1e1e2f', border: 'none', color: '#fff' }} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="cpu_usage" stroke="#ff6384" name="CPU Usage" strokeWidth={2} />
            <Line type="monotone" dataKey="ram_usage" stroke="#36a2eb" name="RAM Usage" strokeWidth={2} />
            <Line type="monotone" dataKey="disk_usage" stroke="#4fd888" name="Disk Usage" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 rounded-xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white text-left border-b border-white/30">
              <th className="py-2 px-3">Recorded At</th>
              <th className="py-2 px-3">CPU (%)</th>
              <th className="py-2 px-3">RAM (%)</th>
              <th className="py-2 px-3">Disk (%)</th>
              <th className="py-2 px-3">Uptime</th>
              <th className="py-2 px-3">OS Name</th>
              <th className="py-2 px-3">Kernel</th>
              <th className="py-2 px-3">UFW Status</th>
              <th className="py-2 px-3">F2B Status</th>
              <th className="py-2 px-3">Total Proc</th>
              <th className="py-2 px-3">Est. Conn</th>
              <th className="py-2 px-3">Last Reboot</th>
              <th className="py-2 px-3">Disk Read</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, idx) => (
              <tr key={idx} className="border-t border-white/20 hover:bg-white/10">
                <td className="py-2 px-3">{item.last_reboot_time}</td>
                <td className="py-2 px-3">{item.cpu_usage}</td>
                <td className="py-2 px-3">{item.ram_usage}</td>
                <td className="py-2 px-3">{item.disk_usage}</td>
                <td className="py-2 px-3">{item.uptime}</td>
                <td className="py-2 px-3">{item.os_name}</td>
                <td className="py-2 px-3">{item.kernel_version}</td>
                <td className="py-2 px-3">{item.ufw_status}</td>
                <td className="py-2 px-3">{item.fail2ban_status}</td>
                <td className="py-2 px-3">{item.total_processes}</td>
                <td className="py-2 px-3">{item.established_connections}</td>
                <td className="py-2 px-3">{item.last_reboot_time}</td>
                <td className="py-2 px-3">{item.disk_read_sectors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;