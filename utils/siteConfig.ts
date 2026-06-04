export type SiteConfig = {
  name: string;
  tagline: string;
  repoUrl: string;
};

// Resolved promise so callers can pass it straight into React `use()`.
const configPromise = Promise.resolve<SiteConfig>({
  name: 'pure-react-19-vanilla-starter',
  tagline: 'Vite + React 19 + vanilla CSS',
  repoUrl: 'https://github.com/briancrabtree-me/pure-react-19-vanilla-starter',
});

export function getSiteConfig() {
  return configPromise;
}
