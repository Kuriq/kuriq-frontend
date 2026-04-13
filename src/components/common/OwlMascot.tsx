interface OwlMascotProps {
  size?: number;
  variant?: "normal" | "winking";
}

export function OwlMascot({ size = 96, variant = "normal" }: OwlMascotProps) {
  const isWinking = variant === "winking";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Owl body */}
      <ellipse cx="48" cy="54" rx="28" ry="32" fill="#E8985E" />
      
      {/* Belly highlight */}
      <ellipse cx="48" cy="60" rx="18" ry="22" fill="#FFF3EB" />
      
      {/* Left ear tuft */}
      <path
        d="M 28 30 Q 22 18 26 14 Q 28 12 32 20 L 30 32 Z"
        fill="#D67A45"
      />
      
      {/* Right ear tuft */}
      <path
        d="M 68 30 Q 74 18 70 14 Q 68 12 64 20 L 66 32 Z"
        fill="#D67A45"
      />
      
      {/* Left eye outer */}
      <circle cx="38" cy="42" r="11" fill="white" />
      
      {/* Right eye - normal or winking */}
      {isWinking ? (
        // Winking eye (curved line)
        <path
          d="M 47 42 Q 58 39 69 42"
          stroke="#2C2C2C"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <circle cx="58" cy="42" r="11" fill="white" />
      )}
      
      {/* Left eye inner */}
      <circle cx="39" cy="42" r="7" fill="#2C2C2C" />
      
      {/* Right eye inner - only if not winking */}
      {!isWinking && <circle cx="57" cy="42" r="7" fill="#2C2C2C" />}
      
      {/* Left eye highlight */}
      <circle cx="40" cy="40" r="3" fill="white" />
      
      {/* Right eye highlight - only if not winking */}
      {!isWinking && <circle cx="58" cy="40" r="3" fill="white" />}
      
      {/* Beak */}
      <path
        d="M 48 48 L 44 54 L 52 54 Z"
        fill="#E8985E"
        stroke="#D67A45"
        strokeWidth="1"
      />
      
      {/* Graduation cap base */}
      <ellipse cx="48" cy="22" rx="24" ry="6" fill="#2C2C2C" />
      
      {/* Graduation cap top */}
      <rect x="36" y="16" width="24" height="6" fill="#2C2C2C" />
      
      {/* Graduation cap board */}
      <rect x="28" y="16" width="40" height="2" fill="#2C2C2C" />
      
      {/* Tassel */}
      <line x1="68" y1="17" x2="74" y2="14" stroke="#E8985E" strokeWidth="2" />
      <circle cx="74" cy="14" r="2.5" fill="#E8985E" />
      
      {/* Left wing */}
      <ellipse
        cx="24"
        cy="58"
        rx="8"
        ry="14"
        fill="#D67A45"
        transform="rotate(-20 24 58)"
      />
      
      {/* Right wing */}
      <ellipse
        cx="72"
        cy="58"
        rx="8"
        ry="14"
        fill="#D67A45"
        transform="rotate(20 72 58)"
      />
      
      {/* Left foot */}
      <path d="M 42 84 L 40 88 M 42 84 L 44 88 M 42 84 L 42 88" stroke="#D67A45" strokeWidth="2" strokeLinecap="round" />
      
      {/* Right foot */}
      <path d="M 54 84 L 52 88 M 54 84 L 56 88 M 54 84 L 54 88" stroke="#D67A45" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
