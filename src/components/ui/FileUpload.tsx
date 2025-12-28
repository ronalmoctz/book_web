import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  maxSizeMB?: number;
  required?: boolean;
  error?: string;
  onFileChange: (file: File | null) => void;
}

/**
 * Componente para subir archivos con preview
 * Incluye validación de tamaño y tipo
 */
export function FileUpload({
  id,
  label,
  accept = "image/png,image/jpeg",
  maxSizeMB = 1,
  required = true,
  error,
  onFileChange,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    // Validar tamaño
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      setFileError(`El archivo excede ${maxSizeMB}MB`);
      return;
    }

    // Validar tipo
    const acceptedTypes = accept.split(",").map(t => t.trim());
    if (!acceptedTypes.includes(selectedFile.type)) {
      setFileError("Tipo de archivo no permitido");
      return;
    }

    setFileError(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    onFileChange(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileChange(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#293241] font-medium">
        {label}
        {required && <span className="text-[#EE6C4D] ml-1">*</span>}
      </Label>
      
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        required={required && !file}
        className="w-full p-2 border border-[#293241] rounded-md bg-white text-[#293241] 
          file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 
          file:text-sm file:font-medium file:bg-[#EE6C4D] file:text-white
          hover:file:bg-[#d95b3d] file:cursor-pointer"
      />

      {previewUrl && (
        <div className="mt-3">
          <p className="text-sm text-[#293241]/70 mb-2">Vista previa:</p>
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs max-h-48 object-contain border-2 border-[#293241] rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 
                flex items-center justify-center text-sm hover:bg-red-600 
                transition-colors shadow-md"
              title="Eliminar imagen"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {(fileError || error) && (
        <span className="text-red-600 text-xs font-medium block">
          {fileError || error}
        </span>
      )}
    </div>
  );
}
