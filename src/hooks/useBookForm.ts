import { useState, useCallback } from "react";
import type { Book } from "@/types/book";

type BookForm = Omit<Book, "id" | "create_at" | "update_at">;

// Reglas de validación por campo
const validationRules: Record<keyof BookForm, {
    min?: number;
    max?: number;
    minLength?: number;
    pattern?: RegExp;
    message?: string;
}> = {
    title: { minLength: 1, message: "El título es obligatorio" },
    description: { minLength: 10, message: "La descripción debe tener al menos 10 caracteres" },
    price: { min: 0.01, max: 10000, message: "El precio debe estar entre 0.01 y 10,000" },
    discount: { min: 0, max: 100, message: "El descuento debe estar entre 0 y 100" },
    rating: { min: 0, max: 5, message: "El rating debe estar entre 0 y 5" },
    is_best_seller: {},
    year: { min: 1900, max: new Date().getFullYear() + 1, message: "Año inválido" },
    edition: { minLength: 1, message: "La edición es obligatoria" },
    stock: { min: 0, max: 999999, message: "Stock inválido" },
    sales: { min: 0, max: 999999, message: "Ventas inválidas" },
    isbn: { pattern: /^[\d-]{10,17}$/, message: "ISBN debe tener entre 10-17 dígitos/guiones" },
    author_id: { min: 1, message: "Selecciona un autor" },
    genre_id: { min: 1, message: "Selecciona un género" },
    publisher_id: { min: 1, message: "Selecciona una editorial" },
    cover: {},
};

/**
 * Hook para gestionar el estado, validación y submit del formulario
 * Sigue el principio de Single Responsibility
 */
export function useBookForm() {
    const [form, setForm] = useState<BookForm>({
        title: "",
        description: "",
        price: 0,
        discount: 0,
        rating: 0,
        is_best_seller: false,
        year: new Date().getFullYear(),
        edition: "",
        stock: 0,
        sales: 0,
        isbn: "",
        author_id: 0,
        genre_id: 0,
        publisher_id: 0,
        cover: "",
    });

    const [touched, setTouched] = useState<{ [K in keyof BookForm]?: boolean }>({});
    const [errors, setErrors] = useState<{ [K in keyof BookForm]?: string }>({});

    /**
     * Valida un campo específico según las reglas definidas
     */
    const validateField = useCallback((key: keyof BookForm, value: string | number | boolean): string => {
        const rules = validationRules[key];
        if (!rules) return "";

        // Campos obligatorios vacíos
        if (typeof value === "string" && value.trim() === "" && rules.minLength) {
            return rules.message || "Este campo es obligatorio";
        }

        if (typeof value === "number") {
            if (rules.min !== undefined && value < rules.min) {
                return rules.message || `El valor mínimo es ${rules.min}`;
            }
            if (rules.max !== undefined && value > rules.max) {
                return rules.message || `El valor máximo es ${rules.max}`;
            }
        }

        if (typeof value === "string" && rules.pattern && !rules.pattern.test(value)) {
            return rules.message || "Formato inválido";
        }

        if (typeof value === "string" && rules.minLength && value.length < rules.minLength) {
            return rules.message || `Mínimo ${rules.minLength} caracteres`;
        }

        return "";
    }, []);

    /**
     * Maneja cambios en los campos del formulario con validación
     */
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;
            const fieldName = name as keyof BookForm;

            let processedValue: string | number;

            if (type === "number") {
                processedValue = value === "" ? 0 : Number(value);
                // Validar rangos para números
                const rules = validationRules[fieldName];
                if (rules?.min !== undefined && processedValue < rules.min) {
                    processedValue = rules.min;
                }
                if (rules?.max !== undefined && processedValue > rules.max) {
                    processedValue = rules.max;
                }
            } else {
                processedValue = value;
            }

            setForm((f) => ({ ...f, [name]: processedValue }));

            // Validar en tiempo real si ya fue tocado
            if (touched[fieldName]) {
                const error = validateField(fieldName, processedValue);
                setErrors((e) => ({ ...e, [fieldName]: error }));
            }
        },
        [touched, validateField]
    );

    /**
     * Actualiza un campo específico del formulario
     */
    const setFieldValue = useCallback(<K extends keyof BookForm>(
        field: K,
        value: BookForm[K]
    ) => {
        setForm((f) => ({ ...f, [field]: value }));

        if (touched[field]) {
            const error = validateField(field, value);
            setErrors((e) => ({ ...e, [field]: error }));
        }
    }, [touched, validateField]);

    /**
     * Marca un campo como tocado y valida
     */
    const handleBlur = useCallback((field: keyof BookForm) => {
        setTouched((t) => ({ ...t, [field]: true }));
        const error = validateField(field, form[field]);
        setErrors((e) => ({ ...e, [field]: error }));
    }, [form, validateField]);

    /**
     * Obtiene el mensaje de error para un campo
     */
    const getError = useCallback((key: keyof BookForm): string => {
        if (!touched[key]) return "";
        return errors[key] || "";
    }, [touched, errors]);

    /**
     * Valida todo el formulario
     */
    const validateAll = useCallback((): boolean => {
        const newErrors: { [K in keyof BookForm]?: string } = {};
        let isValid = true;

        (Object.keys(form) as Array<keyof BookForm>).forEach((key) => {
            const error = validateField(key, form[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        return isValid;
    }, [form, validateField]);

    /**
     * Verifica si el formulario tiene errores
     */
    const hasErrors = Object.values(errors).some((e) => e);

    /**
     * Verifica si hay campos vacíos obligatorios
     */
    const isEmpty = Object.entries(form).some(
        ([key, value]) =>
            key !== "cover" &&
            key !== "is_best_seller" &&
            (typeof value === "string" ? value.trim() === "" : value === 0)
    );

    /**
     * Resetea el formulario
     */
    const resetForm = useCallback(() => {
        setForm({
            title: "",
            description: "",
            price: 0,
            discount: 0,
            rating: 0,
            is_best_seller: false,
            year: new Date().getFullYear(),
            edition: "",
            stock: 0,
            sales: 0,
            isbn: "",
            author_id: 0,
            genre_id: 0,
            publisher_id: 0,
            cover: "",
        });
        setTouched({});
        setErrors({});
    }, []);

    return {
        form,
        setForm,
        setFieldValue,
        touched,
        errors,
        handleChange,
        handleBlur,
        getError,
        validateAll,
        hasErrors,
        isEmpty,
        resetForm,
    };
}
