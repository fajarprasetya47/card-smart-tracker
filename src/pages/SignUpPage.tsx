import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthBrand } from '../components/AuthBrand';

export function SignUpPage() {
  const [notice, setNotice] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('Account creation is not available in this prototype. No account was created.');
  }

  return (
    <main className="login-page">
      <AuthBrand />

      <section className="login-panel" aria-labelledby="signup-title">
        <h1 id="signup-title">Create your account</h1>
        <p className="login-subtitle">Join Nova — smart banking with AI-powered insights.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <button className="login-submit" type="submit">Create Account</button>
          {notice && <p className="auth-notice" role="status">{notice}</p>}
        </form>

        <p className="login-signup">
          Already a member? <Link className="login-text-link" to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
