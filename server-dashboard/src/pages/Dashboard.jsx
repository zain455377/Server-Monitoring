import React, { useEffect, useState } from 'react';
import ServerCard from '../components/ServerCard';
import ServerDetailModal from '../components/ServerDetailModal';

const Dashboard = ({ searchTerm = '' }) => {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    
  fetch("http://localhost:5000/api/metrics")
    .then(res => res.json())
    .then(data => {
      setServers(data);
    })
    .catch(err => console.error('Error fetching servers:', err));
}, []);

  const filteredServers = servers.filter(server =>
  server.server_display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  server.server_ip.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServers.map(server => (
          <ServerCard
            key={server.id}
            server={server}
            onClick={() => setSelectedServer(server)}
          />
        ))}
      </div>

      {selectedServer && (
        <ServerDetailModal
          server={selectedServer}
          onClose={() => setSelectedServer(null)}
        />
      )}
    </div>     
  );
};

export default Dashboard;