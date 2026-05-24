export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  // Base styles
  const baseStyles = 'font-semibold rounded transition-all inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';

  // Disabled state
  const disabledStyles = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';

  // Size variants
  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Style variants
  const variantStyles = {
    primary: `bg-gradient-to-b from-success-400 to-success-500 border border-success-600 text-gray-900 hover:from-success-300 hover:to-success-600 disabled:hover:from-success-400 disabled:hover:to-success-500 shadow-md hover:shadow-lg`,
    secondary: `bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 disabled:hover:bg-white`,
    outline: `border-2 border-navy-500 text-navy-600 bg-transparent hover:bg-navy-50 disabled:hover:bg-transparent`,
    ghost: `text-primary-600 hover:bg-primary-50 disabled:hover:bg-transparent`,
    danger: `bg-red-500 border border-red-600 text-white hover:bg-red-600 disabled:hover:bg-red-500 shadow-md hover:shadow-lg`,
  };

  const finalClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabledStyles}
    ${className}
  `.trim();

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
