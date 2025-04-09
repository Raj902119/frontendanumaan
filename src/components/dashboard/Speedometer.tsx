interface SpeedometerProps {
  percentage: number;
}

export const Speedometer = ({ percentage }: SpeedometerProps) => {
  // Convert percentage to degrees (0-100% maps to 0-180 degrees)
  const degrees = (percentage / 100) * 180;

  // Determine color based on percentage range
  const getColor = (percent: number) => {
    if (percent <= 50) return '#ef4444'; // blue-500
    return '#6aa68b'; // green-500
  };

  return (
    <div className="flex flex-col mt-1">
      <div className="relative sm:w-[70px] sm:h-[35px] aa:w-[50px] aa:h-[28px]">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 70 37"
          style={{ overflow: 'visible' }}
        >
          {/* Add defs for gradient and animation */}
          <defs>
            <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)">
                <animate
                  attributeName="offset"
                  values="-1; 2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)">
                <animate
                  attributeName="offset"
                  values="-0.5; 2.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="rgba(255,255,255,0)">
                <animate
                  attributeName="offset"
                  values="0; 3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d="M 2 35 A 33 33 0 0 1 68 35"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Animated progress arc */}
          <path
            d="M 2 35 A 33 33 0 0 1 68 35"
            fill="none"
            stroke={getColor(percentage)}
            strokeWidth="4"
            strokeDasharray={`${(degrees/180) * 105} 105`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 1000ms ease-out, stroke 500ms ease-out'
            }}
          />

          {/* Shining overlay */}
          <path
            d="M 2 35 A 33 33 0 0 1 68 35"
            fill="none"
            stroke="url(#shine)"
            strokeWidth="4"
            strokeDasharray={`${(degrees/180) * 105} 105`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 1000ms ease-out'
            }}
          />
        </svg>
        
        {/* Percentage Text */}
        <div className="absolute w-full text-center aa:-bottom-[6px] sm:-bottom-[10px]">
          <span 
            className="aa:text-[12px] sm:text-[17px] font-semibold transition-colors duration-500"
            style={{ color: getColor(percentage) }}
          >
            {percentage}%
          </span>
          <p className="aa:text-[10px] sm:text-[12px] text-neutral-500 aa:-mt-[6px]">Chance</p>
        </div>
      </div>
    </div>
  );
}; 