import kuriDefault from "../../assets/images/kuri-default.png";
import kuriWink from "../../assets/images/kuri-wink.png";

interface OwlMascotProps {
  size?: number;
  variant?: "normal" | "winking";
}

export function OwlMascot({ size = 96, variant = "normal" }: OwlMascotProps) {
  const src = variant === "winking" ? kuriWink : kuriDefault;

  return (
    <img
      src={src}
      alt="큐리 마스코트"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", display: "block", flexShrink: 0 }}
    />
  );
}
