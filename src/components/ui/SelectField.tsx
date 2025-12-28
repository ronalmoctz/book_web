import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

interface SelectOption {
  id: number;
  name: string;
  last_name?: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  placeholder: string;
  groupLabel: string;
  options: SelectOption[];
  value: number;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: number) => void;
  onBlur?: () => void;
}

/**
 * Componente reutilizable para campos de selección
 * Elimina duplicación de código (DRY)
 */
export function SelectField({
  id,
  label,
  placeholder,
  groupLabel,
  options,
  value,
  error,
  required = true,
  disabled = false,
  onChange,
  onBlur,
}: SelectFieldProps) {
  const getOptionLabel = (option: SelectOption) => {
    return option.last_name 
      ? `${option.name} ${option.last_name}` 
      : option.name;
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[#293241] font-medium">
        {label}
        {required && <span className="text-[#EE6C4D] ml-1">*</span>}
      </Label>
      <Select
        value={value ? value.toString() : ""}
        onValueChange={(val) => {
          onChange(Number(val));
          onBlur?.();
        }}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger 
          id={id}
          className="w-full bg-white border-[#293241] focus:border-[#EE6C4D] focus:ring-[#EE6C4D]/20"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            <SelectLabel className="text-[#293241]/60">{groupLabel}</SelectLabel>
            {options.map((option) => (
              <SelectItem 
                key={option.id} 
                value={option.id.toString()}
                className="focus:bg-[#FFD9A0]"
              >
                {getOptionLabel(option)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <span className="text-red-600 text-xs font-medium block mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
