import { ToggleSwitch } from "./ToggleSwitch";

interface NotificationItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function NotificationItem({
  title,
  description,
  enabled,
  onChange,
}: NotificationItemProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-5 border-b border-[#E5E0D8] last:border-b-0">
      <div className="flex-1">
        <h4 className="text-[15px] font-[600] text-[#2C2C2C] mb-1.5">
          {title}
        </h4>
        <p className="text-[13px] text-[#777777] leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 pt-0.5">
        <ToggleSwitch enabled={enabled} onChange={onChange} />
      </div>
    </div>
  );
}
