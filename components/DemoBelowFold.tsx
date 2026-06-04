const FEATURES = [
  {
    title: 'CSS before JS',
    body: 'postbuild-html.mjs moves the stylesheet ahead of the module tag. Vite default order FOUCs.',
  },
  {
    title: 'Inline shell',
    body: 'index.html paints nav + hero before React boots; shell drops after the hero image loads.',
  },
  {
    title: 'Idle hook',
    body: 'useIdleEffect runs analytics-shaped work after requestIdleCallback (or a short timeout).',
  },
  {
    title: 'core-ui chunk',
    body: 'react + react-dom + react-router-dom in one file; postbuild strips modulepreload on it.',
  },
] as const;

export default function DemoBelowFold() {
  return (
    <section aria-labelledby="features-title">
      <h2 id="features-title" className="section-title">
        Included patterns
      </h2>
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <article key={f.title} className="feature-card">
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
