import { Link, useNavigate } from 'react-router-dom';
import { AuthBrand } from '../components/AuthBrand';

export function LoginPage() {
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate('/');
  }

  return (
    <main className="login-page">
      <AuthBrand />

      <section className="login-panel" aria-labelledby="login-title">
        <h1 id="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to access your AI-powered banking dashboard.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="budi@nova.id"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <div className="login-password-label">
              <label htmlFor="login-password">Password</label>
              <Link className="login-text-link" to="/forgot-password">Forgot password?</Link>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="login-submit" type="submit">Sign In</button>
        </form>

        <p className="login-signup">
          Don&apos;t have an account? <Link className="login-text-link" to="/sign-up">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
