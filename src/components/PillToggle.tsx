interface PillToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  accent?: "yellow" | "green" | "orange";
  disabled?: boolean;
}

const ACCENTS = {
  yellow: { on: "linear-gradient(135deg, #F5B300 0%, #E8A800 100%)", glow: "rgba(245,179,0,0.4)" },
  green:  { on: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", glow: "rgba(34,197,94,0.4)" },
  orange: { on: "linear-gradient(135deg, #E85D04 0%, #C94F00 100%)", glow: "rgba(232,93,4,0.4)" },
};

export default function PillToggle({ checked, onChange, accent = "yellow", disabled = false }: PillToggleProps) {
  const { on, glow } = ACCENTS[accent];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: "relative",
        width: 52,
        height: 30,
        borderRadius: 999,
        border: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        background: checked ? on : "#2A2A2A",
        boxShadow: checked
          ? `0 0 0 1px ${glow}, inset 0 1px 2px rgba(0,0,0,0.2)`
          : "inset 0 1px 3px rgba(0,0,0,0.5)",
        transition: "background 0.25s ease, box-shadow 0.25s ease",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 25 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 1px 4px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.08)",
          transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
          display: "block",
        }}
      />
    </button>
  );
}
