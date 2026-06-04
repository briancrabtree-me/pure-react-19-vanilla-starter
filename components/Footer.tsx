export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <p>
        © {year} Brian Crabtree · ALL RIGHTS RESERVED · MIT ·{' '}
        <a
          href="https://github.com/briancrabtree-me/pure-react-19-vanilla-starter"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        {' · '}
        <a href="https://briancrabtree.me/" rel="noopener noreferrer">
          briancrabtree.me
        </a>
      </p>
    </footer>
  );
}
