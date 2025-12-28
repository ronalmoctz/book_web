import { useFetch } from "./useFetch";
import type { Book } from "@/types/book";
import type { Author } from "@/types/author";

// Tipo genérico para representar datos con id y name
interface Genre {
    id: number;
    name: string;
}

interface Publisher {
    id: number;
    name: string;
}

/**
 * Hook especializado para obtener libros
 */
export function useBooks() {
    const { data, loading, error, cancelRequest } = useFetch<Book[]>("/books", []);

    return {
        books: data ?? [],
        loading,
        error,
        cancelRequest,
    };
}

/**
 * Hook especializado para obtener autores
 */
export function useAuthors() {
    const { data, loading, error, cancelRequest } = useFetch<Author[]>("/authors", []);

    return {
        authors: data ?? [],
        loading,
        error,
        cancelRequest,
    };
}

/**
 * Hook especializado para obtener géneros
 */
export function useGenres() {
    const { data, loading, error, cancelRequest } = useFetch<Genre[]>("/genres", []);

    return {
        genres: data ?? [],
        loading,
        error,
        cancelRequest,
    };
}

/**
 * Hook especializado para obtener editoriales
 */
export function usePublishers() {
    const { data, loading, error, cancelRequest } = useFetch<Publisher[]>("/publishers", []);

    return {
        publishers: data ?? [],
        loading,
        error,
        cancelRequest,
    };
}

/**
 * Hook combinado para formularios que necesitan múltiples recursos
 * Reduce la duplicación de código en componentes de formulario
 */
export function useBookFormData() {
    const { authors, loading: loadingAuthors, error: errorAuthors } = useAuthors();
    const { genres, loading: loadingGenres, error: errorGenres } = useGenres();
    const { publishers, loading: loadingPublishers, error: errorPublishers } = usePublishers();

    const loading = loadingAuthors || loadingGenres || loadingPublishers;
    const error = errorAuthors || errorGenres || errorPublishers;

    return {
        authors,
        genres,
        publishers,
        loading,
        error,
    };
}
