import type { Author } from "../types/author";
import type { Book } from "../types/book";

interface AuthorsListProps {
  authors: Author[];
  books: Book[];
}

export default function AuthorsList({ authors, books }: AuthorsListProps) {
  // Obtener IDs de autores que tienen al menos un libro
  const authorIdsWithBooks = new Set(books.map((b) => b.author_id));
  const filteredAuthors = authors.filter((a) => authorIdsWithBooks.has(a.id));

  if (!authors.length) return <div>No hay autores</div>;
  if (!filteredAuthors.length) return <div>No hay autores con libros</div>;

  return (
    <ul>
      {filteredAuthors.map((author) => (
        <li key={author.id}>{author.name}</li>
      ))}
    </ul>
  );
}
