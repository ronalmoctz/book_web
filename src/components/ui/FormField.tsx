import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "password";
  step?: string;
  value?: string | number;
  placeholder?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

/**
 * Componente reutilizable para campos de formulario
 * - Estilos consistentes con fondo blanco
 * - Validación integrada con mensajes de error
 * - Props extendidas para mejor validación HTML5
 */
export function FormField({
  id,
  label,
  name,
  type = "text",
  step,
  value,
  placeholder,
  error,
  required = true,
  min,
  max,
  minLength,
  maxLength,
  disabled = false,
  onChange,
  onBlur,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[#293241] font-medium">
        {label}
        {required && <span className="text-[#EE6C4D] ml-1">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
        className="bg-white border-[#293241] focus:border-[#EE6C4D] focus:ring-[#EE6C4D]/20"
      />
      {error && (
        <span className="text-red-600 text-xs font-medium block mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
