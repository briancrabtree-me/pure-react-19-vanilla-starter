import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { scheduleHeroLcpFallback } from './utils/prerenderShell';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

// StrictMode double-mounts in dev; skip in prod to keep PSI main-thread quiet.
const isProd = import.meta.env.PROD;
const tree = <App />;

createRoot(rootEl).render(isProd ? tree : <StrictMode>{tree}</StrictMode>);
scheduleHeroLcpFallback(5000);
