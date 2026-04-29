// Liaison Logo — matches the reference site exactly:
// Outer ring (blue→purple gradient), center filled dot
const LiaisonLogo = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#6ec8ff" />
        <stop offset="1" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    {/* Outer ring */}
    <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
    {/* Inner ring */}
    <circle cx="20" cy="20" r="10" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none" opacity="0.5" />
    {/* Center dot */}
    <circle cx="20" cy="20" r="5" fill="url(#logoGrad)" />
  </svg>
);

export default LiaisonLogo;
