import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="page-shell not-found-card">
      <div className="empty-state">
        <span className="empty-symbol">404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for doesn't exist.</p>
        <Link className="button-primary button-link" to="/">Back to Dashboard</Link>
      </div>
    </main>
  );
}
