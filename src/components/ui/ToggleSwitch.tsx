import { Label } from "@/components/ui/label";

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
}

/**
 * Componente Switch/Toggle reutilizable
 * Para campos booleanos como is_best_seller
 */
export function ToggleSwitch({
  id,
  label,
  checked,
  onChange,
  onBlur,
}: ToggleSwitchProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[#293241] font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          onBlur={onBlur}
          className={`
            relative inline-flex h-7 w-12 items-center rounded-full 
            transition-colors duration-200 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-[#EE6C4D] focus:ring-offset-2
            ${checked ? "bg-[#EE6C4D]" : "bg-gray-300"}
          `}
        >
          <span
            className={`
              inline-block h-5 w-5 transform rounded-full bg-white shadow-md
              transition-transform duration-200 ease-in-out
              ${checked ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
        <span 
          className={`text-sm font-medium ${
            checked ? "text-[#EE6C4D]" : "text-[#293241]/60"
          }`}
        >
          {checked ? "Sí" : "No"}
        </span>
      </div>
    </div>
  );
}
