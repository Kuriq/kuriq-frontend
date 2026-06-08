export function CommunityEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#E5E0D8] bg-white px-6 py-12 text-center">
      <h3 className="mb-2 text-[18px] font-[800] text-[#2C2C2C]">{title}</h3>
      <p className="text-[14px] text-[#777777]">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full border border-[#D9D2C7] bg-[#F8F6F1] px-5 py-2 text-[13px] font-[700] text-[#3B6B4A] transition-colors hover:bg-[#F1EDE4]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
