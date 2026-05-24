import { AlertCircle, X } from 'lucide-react';
import Button from './Button';
import { useState } from 'react';

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  dismissible = true,
  className = '',
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 ${className}`.trim()}
      role="alert"
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Try Again
              </Button>
            )}
            {dismissible && (
              <button
                onClick={() => setDismissed(true)}
                className="text-sm text-red-700 hover:text-red-800 font-medium transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>

        {/* Close button (if dismissible) */}
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors p-1"
            aria-label="Close error message"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
