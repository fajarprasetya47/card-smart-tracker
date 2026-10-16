import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthBrand } from '../components/AuthBrand';

export function ForgotPasswordPage() {
  const [notice, setNotice] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('Password reset is not available in this prototype. No email was sent.');
  }

  return (
    <main className="login-page">
      <AuthBrand />
      <section className="login-panel" aria-labelledby="reset-title">
        <h1 id="reset-title">Reset password</h1>
        <p className="login-subtitle">Enter your email and we&apos;ll send you a reset link.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              name="email"
              type="email"
              placeholder="budi@nova.id"
              autoComplete="email"
              required
            />
          </div>
          <button className="login-submit" type="submit">Send Reset Link</button>
          {notice && <p className="auth-notice" role="status">{notice}</p>}
        </form>

        <p className="login-signup">
          Remember it? <Link className="login-text-link" to="/login">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
