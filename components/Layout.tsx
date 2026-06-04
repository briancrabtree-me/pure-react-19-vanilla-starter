import { lazy, Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// Home PSI path: footer is below the fold and not on the critical route.
const Footer = lazy(() => import('./Footer'));

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" className="site-brand" end>
            pure<em>-react-19</em>
          </NavLink>
          <ul className="site-nav-links">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
