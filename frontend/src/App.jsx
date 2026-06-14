import { useEffect, useState } from 'react';
import { socket } from './services/socket';
import { healthCheck } from './services/api';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking...');
  const [socketStatus, setSocketStatus] = useState('disconnected');

  useEffect(() => {
    // Probe the backend health endpoint on mount.
    healthCheck()
      .then((data) => setApiStatus(data?.status || 'ok'))
      .catch(() => setApiStatus('unreachable'));

    // Wire up socket lifecycle events.
    const onConnect = () => setSocketStatus('connected');
    const onDisconnect = () => setSocketStatus('disconnected');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-credchain-dark text-white flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold text-credchain-primary">CredChain</h1>
      <p className="text-slate-300">Blockchain-powered universal credential network · Solana</p>

      <div className="mt-4 grid gap-3 text-sm">
        <div className="rounded-lg bg-slate-800 px-4 py-2">
          Backend API: <span className="font-mono text-credchain-accent">{apiStatus}</span>
        </div>
        <div className="rounded-lg bg-slate-800 px-4 py-2">
          Socket.io: <span className="font-mono text-credchain-accent">{socketStatus}</span>
        </div>
      </div>
    </div>
  );
}
