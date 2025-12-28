import type { Author } from "@/types/author";

/**
 * Crea un mapa de IDs de autor a nombres completos
 */
export function createAuthorMap(authors: Author[]): Map<number, string> {
    const map = new Map<number, string>();
    authors.forEach((author) => {
        map.set(author.id, getAuthorFullName(author));
    });
    return map;
}

/**
 * Obtiene el nombre completo de un autor
 */
export function getAuthorFullName(author: Author): string {
    return `${author.name} ${author.last_name}`;
}

/**
 * Obtiene el nombre de un autor por su ID desde un mapa
 */
export function getAuthorNameById(
    authorId: number,
    authorMap: Map<number, string>
): string {
    return authorMap.get(authorId) ?? "Autor desconocido";
}
