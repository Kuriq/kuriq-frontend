import { Star } from "lucide-react";

export function CommunityRatingStars({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}) {
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const current = index + 1;
        const filled = current <= value;

        if (onChange) {
          return (
            <button
              key={current}
              type="button"
              onClick={() => onChange(current)}
              className="rounded-md p-0.5 text-[#E7A53D] transition-transform hover:scale-105"
              aria-label={`${current}점 선택`}
            >
              <Star className={`${iconClass} ${filled ? "fill-current" : ""}`} />
            </button>
          );
        }

        return <Star key={current} className={`${iconClass} text-[#E7A53D] ${filled ? "fill-current" : ""}`} />;
      })}
    </div>
  );
}
