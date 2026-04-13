interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3B6B4A] focus:ring-offset-2 ${
        enabled ? "bg-[#3B6B4A]" : "bg-[#CCCCCC]"
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
