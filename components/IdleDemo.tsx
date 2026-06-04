import { useState } from 'react';
import { useIdleEffect } from '../hooks/useIdleEffect';

export default function IdleDemo() {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('Scheduling idle work…');

  useIdleEffect(() => {
    setMessage('Idle callback fired — wire analytics or secondary fetches here.');
    setReady(true);
  }, []);

  return (
    <aside className="idle-demo" data-ready={ready} aria-live="polite">
      <strong>useIdleEffect demo:</strong> {message}
    </aside>
  );
}
