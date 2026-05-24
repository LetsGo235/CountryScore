/**
 * StarRating Component
 * 
 * Displays a 1-5 star rating from a 1-10 score value.
 * Converts: score / 2 = rating out of 5
 * 
 * Props:
 * - score: number (1-10) - the score to display
 * - size: 'sm' | 'md' | 'lg' - star size
 * - showScore: boolean - whether to display the numeric score
 * - className: string - additional CSS classes
 */

export default function StarRating({
  score = 5,
  size = 'md',
  showScore = false,
  className = '',
}) {
  // Convert 1-10 score to 1-5 stars
  const rating = Math.max(0, Math.min(10, Number(score))) / 2;

  // Size mapping
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  // Render individual stars
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // Full star
        stars.push(
          <span key={`star-${i}`} className="text-success-500" aria-label="filled star">
            ★
          </span>
        );
      } else if (rating >= i - 0.5) {
        // Half star
        stars.push(
          <span key={`star-${i}`} className="text-success-500" aria-label="half star">
            ★
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={`star-${i}`} className="text-gray-300" aria-label="empty star">
            ☆
          </span>
        );
      }
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <div
        className={`${sizeMap[size]} leading-none tracking-wider whitespace-nowrap font-normal`}
        role="img"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {renderStars()}
      </div>
      {showScore && (
        <span className="text-sm font-semibold text-primary-600">
          {(score / 2).toFixed(1)}/5
        </span>
      )}
    </div>
  );
}
