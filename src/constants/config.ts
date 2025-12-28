/**
 * Constantes de la aplicación Book Web
 * Centraliza valores reutilizables para facilitar mantenimiento
 */

// Paleta de colores de la aplicación
export const COLORS = {
    bg: {
        primary: "#FFF8ED",
        card: "#FFD9A0",
        white: "#FFFFFF",
    },
    text: {
        primary: "#293241",
        secondary: "#293241B3", // 70% opacity
        muted: "#29324199", // 60% opacity
    },
    accent: {
        primary: "#EE6C4D",
        hover: "#d95b3d",
        active: "#c44d2f",
    },
    extra: "#201A17",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
} as const;

// Configuración de validación de formularios
export const VALIDATION = {
    book: {
        title: { minLength: 1, maxLength: 200 },
        description: { minLength: 10, maxLength: 2000 },
        price: { min: 0.01, max: 10000 },
        discount: { min: 0, max: 100 },
        rating: { min: 0, max: 5, step: 0.1 },
        year: { min: 1900, max: new Date().getFullYear() + 1 },
        stock: { min: 0, max: 999999 },
        sales: { min: 0, max: 999999 },
        isbn: { pattern: /^[\d-]{10,17}$/ },
    },
    file: {
        maxSizeMB: 1,
        acceptedTypes: ["image/png", "image/jpeg"],
    },
} as const;

// Configuración de la API
export const API = {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
    endpoints: {
        books: "/books",
        authors: "/authors",
        genres: "/genres",
        publishers: "/publishers",
    },
    timeout: 10000,
} as const;

// Configuración de UI
export const UI = {
    card: {
        height: "580px",
        imageHeight: "288px", // h-72
    },
    modal: {
        maxWidth: "4xl",
    },
    grid: {
        columns: {
            sm: 2,
            lg: 3,
            xl: 4,
        },
    },
    animation: {
        duration: 200,
        hoverScale: 1.02,
    },
} as const;

// Mensajes de la aplicación
export const MESSAGES = {
    loading: {
        general: "Cargando...",
        books: "Cargando libros...",
        form: "Cargando datos del formulario...",
    },
    success: {
        bookCreated: "¡Libro creado exitosamente!",
        bookUpdated: "Libro actualizado correctamente",
        bookDeleted: "Libro eliminado",
    },
    error: {
        general: "Ha ocurrido un error",
        network: "Error de conexión. Verifica tu internet.",
        validation: "Por favor corrige los errores en el formulario",
        coverRequired: "Selecciona una portada para el libro",
        fieldsRequired: "Todos los campos son obligatorios",
    },
    validation: {
        required: "Este campo es obligatorio",
        minLength: (min: number) => `Mínimo ${min} caracteres`,
        maxLength: (max: number) => `Máximo ${max} caracteres`,
        minValue: (min: number) => `El valor mínimo es ${min}`,
        maxValue: (max: number) => `El valor máximo es ${max}`,
        invalidFormat: "Formato inválido",
    },
    aria: {
        bookCatalog: "Catálogo de libros disponibles",
        bookCard: (title: string) => `Ver detalles del libro ${title}`,
        bookCover: (title: string, author: string) => `Portada del libro ${title} por ${author}`,
        bestSeller: "Este libro es un Best Seller",
        searchBooks: "Buscar libros por título",
        openSearch: "Abrir búsqueda de libros",
        closeModal: "Cerrar ventana de detalles",
        buyBook: (title: string) => `Comprar el libro ${title}`,
        backToHome: "Volver a la página principal",
        submitForm: "Guardar libro",
        loadingSpinner: "Procesando...",
    },
} as const;

// Metadatos SEO
export const SEO = {
    defaultTitle: "📚 Book Web - Tu Tienda de Libros Online",
    titleTemplate: "%s | Book Web",
    description: "Descubre y compra libros de los mejores autores y editoriales. Amplio catálogo con best sellers, nuevos lanzamientos y clásicos.",
    keywords: "libros, tienda online, best sellers, comprar libros, librería virtual",
    author: "Book Web",
    url: "https://bookweb.vercel.app",
    locale: "es_ES",
} as const;
