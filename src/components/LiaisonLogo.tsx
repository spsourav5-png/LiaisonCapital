const LiaisonLogo = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))' }}
  >
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#D4AF37" />
        <stop offset="0.5" stopColor="#F9E076" />
        <stop offset="1" stopColor="#C5A028" />
      </linearGradient>
    </defs>
    {/* Outer ring */}
    <circle cx="20" cy="20" r="18" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" />
    {/* Inner ring */}
    <circle cx="20" cy="20" r="12" stroke="url(#goldGrad)" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="2 2" />
    {/* Center Mark */}
    <path d="M15 15L25 25M25 15L15 25" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default LiaisonLogo;
