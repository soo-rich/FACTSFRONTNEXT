const CircularProgress = ({ size = 40, strokeWidth = 4, className = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className={`inline-block ${className}`}>
      <svg width={size} height={size} className="animate-spin" viewBox={`0 0 ${size} ${size}`}>
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-20"
        />
        {/* Cercle de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          className="opacity-75"
          style={{
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
