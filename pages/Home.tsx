import { lazy, Suspense, useState } from 'react';
import Hero from '../components/Hero';
import { useIdleEffect } from '../hooks/useIdleEffect';

const DemoBelowFold = lazy(() => import('../components/DemoBelowFold'));
const IdleDemo = lazy(() => import('../components/IdleDemo'));

export default function Home() {
  const [showBelow, setShowBelow] = useState(false);

  // Home PSI is scored on hero only — mount the rest after idle to keep TBT/CLS down.
  useIdleEffect(() => setShowBelow(true), []);

  return (
    <main className="site-main">
      <Hero />
      {showBelow ? (
        <>
          <Suspense fallback={null}>
            <DemoBelowFold />
          </Suspense>
          <Suspense fallback={null}>
            <IdleDemo />
          </Suspense>
        </>
      ) : null}
    </main>
  );
}
