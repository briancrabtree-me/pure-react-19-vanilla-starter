import { useActionState } from 'react';
import '../styles/pages.css';

type FormState = { ok: boolean; message: string };

async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Enter a valid email (demo only — nothing is sent).' };
  }
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true, message: `Demo received for ${email}. Wire your API here.` };
}

const initial: FormState = { ok: false, message: '' };

// Demo form only — no network; replace submitContact when you wire a backend.
export default function About() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  return (
    <main className="site-main about-page">
      <h1>Architecture</h1>
      <p>
        Stripped-down copy of how briancrabtree.me loads: inline shell, postbuild CSS-before-JS,
        one vendor chunk, idle hooks. Details in <code>docs/ARCHITECTURE.md</code>.
      </p>
      <ul className="stack-list">
        <li>React 19 with native <code>use()</code> for static config</li>
        <li>
          <code>useActionState</code> on the demo form below (no form library)
        </li>
        <li>react-router v7 — two routes + static HTML shells for crawlers</li>
        <li>Vanilla CSS custom properties — zero preprocessors</li>
      </ul>

      <form className="contact-form" action={formAction}>
        <label htmlFor="contact-email">
          Email (demo)
          <input id="contact-email" type="email" name="email" required autoComplete="email" />
        </label>
        <label htmlFor="contact-message">
          Message
          <textarea id="contact-message" name="message" rows={3} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Sending…' : 'Submit demo'}
        </button>
        <p
          className="form-status"
          role="status"
          aria-live="polite"
          data-state={state.ok ? 'success' : state.message ? 'error' : undefined}
        >
          {state.message}
        </p>
      </form>
    </main>
  );
}
