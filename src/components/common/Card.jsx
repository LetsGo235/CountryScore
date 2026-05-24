export default function Card({
  children,
  hoverable = true,
  padding = true,
  className = '',
}) {
  const baseStyles = 'bg-white rounded-lg border border-border shadow-sm';
  const hoverStyles = hoverable ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-200' : '';
  const paddingStyles = padding ? 'p-4 sm:p-6' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`.trim()}>
      {children}
    </div>
  );
}
