import { use } from 'react';
import { getSiteConfig } from '../utils/siteConfig';
import { markHeroLcpReady } from '../utils/prerenderShell';

const base = import.meta.env.BASE_URL;

export default function Hero() {
  const config = use(getSiteConfig());

  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        className="hero-visual"
        src={`${base}demo-hero.webp`}
        alt=""
        width={160}
        height={120}
        fetchPriority="high"
        decoding="async"
        onLoad={() => markHeroLcpReady()}
      />
      <h1 id="hero-title" className="hero-title">
        React 19.<em>Zero bloat.</em>
      </h1>
      <p className="hero-lead">
        {config.tagline}. Blocking CSS before the module script — same head order as{' '}
        <a href="https://briancrabtree.me/" rel="noopener noreferrer">
          briancrabtree.me
        </a>
        .
      </p>
      <div className="hero-cta">
        <a className="btn btn-primary" href={config.repoUrl} rel="noopener noreferrer">
          View on GitHub
        </a>
        <a className="btn" href={`${base}about`}>
          Architecture
        </a>
      </div>
    </section>
  );
}
