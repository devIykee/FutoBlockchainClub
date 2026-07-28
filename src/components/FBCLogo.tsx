interface FBCLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FBCLogo({ size = 'md', className = '' }: FBCLogoProps) {
  const sizeMap = {
    sm: 28,
    md: 36,
    lg: 40,
  };

  const dimension = sizeMap[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 1254 1254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="1254" height="1254" fill="currentColor" opacity="0" />
      <g fill="currentColor">
        <path d="M148 384L374 384L374 732L540 732L540 384L766 384L766 1064L540 1064L540 900L374 900L374 1064L148 1064L148 384Z" />
        <path d="M1104 384L1104 1064L796 1064L796 384L1104 384ZM1000 470L900 470L900 720L1000 720L1000 470ZM1000 810L900 810L900 970L1000 970L1000 810Z" />
        <path d="M528 470L528 720L620 720L620 470L528 470ZM528 810L620 810L620 970L528 970L528 810Z" />
      </g>
    </svg>
  );
}

export function FBCLogoText({ size = 'md', className = '' }: FBCLogoProps) {
  const sizeMap = {
    sm: 28,
    md: 36,
    lg: 40,
  };

  const dimension = sizeMap[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 1254 1254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="627" cy="627" r="627" fill="#013AEC" />
      <g fill="white">
        <polygon points="148,384 374,384 374,732 540,732 540,384 766,384 766,1064 540,1064 540,900 374,900 374,1064 148,1064" />
        <polygon points="528,470 528,720 620,720 620,470" />
        <polygon points="528,810 620,810 620,970 528,970" />
        <polygon points="796,384 1104,384 1104,1064 796,1064" />
      </g>
    </svg>
  );
}