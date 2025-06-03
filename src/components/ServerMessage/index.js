'use client';

export default function ServerMessage({ message, type = 'error' }) {
  if (!message) return null;

  return (
    <div className={`server-message ${type}`}>
      {message}
      <style jsx>{`
        .server-message {
          padding: 0.75rem;
          border-radius: var(--border-radius);
          margin-bottom: 1rem;
          text-align: center;
          font-size: var(--font-size-xs);
        }
        .error {
          color: var(--color-error, #dc2626);
          background-color: var(--color-error-light, #fee2e2);
        }
        .success {
          color: var(--color-success, #059669);
          background-color: var(--color-success-light, #d1fae5);
        }
      `}</style>
    </div>
  );
}
