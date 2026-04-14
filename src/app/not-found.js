import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg text-center px-6">
      <div>
        <h1 className="font-display text-6xl font-light text-brand-dark mb-4">404</h1>
        <p className="text-brand-muted mb-8">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-flex px-8 py-3 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-brand-gold transition-colors no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
