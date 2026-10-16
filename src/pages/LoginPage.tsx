import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthBrand } from '../components/AuthBrand';
import { useAuth } from '../state/AuthProvider';

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    try {
      await login(email, password);
      const state = location.state as LoginLocationState | null;
      navigate(state?.from?.pathname || '/', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof TypeError
          ? 'Tidak dapat terhubung ke server. Pastikan backend berjalan, lalu coba lagi.'
          : error instanceof Error
            ? error.message
            : 'Login gagal. Silakan coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
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

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
          {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
        </form>

        <p className="login-signup">
          Don&apos;t have an account? <Link className="login-text-link" to="/sign-up">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
