import { useState, useMemo } from "react";
import { useBooks, useAuthors } from "./hooks/useBooks";
import { createAuthorMap, getAuthorNameById } from "./utils/authors";
import { MESSAGES } from "./constants/config";
import type { Book } from "./types/book";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";
import { BookSearch } from "@/components/Search";
import { BookModal } from "@/components/BookModal";

export default function BookList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { books, loading, error } = useBooks();
  const { authors, loading: loadingAuthors, error: errorAuthors } = useAuthors();

  const authorMap = useMemo(() => createAuthorMap(authors), [authors]);

  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books;
    return books.filter((b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // Estado de carga
  if (loading || loadingAuthors) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-[#FFF8ED]"
        role="status"
        aria-live="polite"
        aria-label={MESSAGES.aria.loadingSpinner}
      >
        <div className="text-center">
          <div 
            className="animate-spin w-12 h-12 border-4 border-[#EE6C4D] border-t-transparent rounded-full mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-[#293241] text-lg">{MESSAGES.loading.books}</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || errorAuthors) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-[#FFF8ED]"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center p-8 bg-red-100 rounded-lg border-2 border-red-500 max-w-md">
          <p className="text-red-600 text-lg mb-4">
            {error?.message || errorAuthors?.message || MESSAGES.error.general}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#EE6C4D] text-white"
            aria-label="Reintentar carga de la página"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="min-h-screen flex flex-col p-6 md:p-10 bg-[#FFF8ED]"
      role="main"
    >
      {/* Screen reader only - h1 principal */}
      <h1 className="sr-only">Catálogo de Libros Online</h1>

      <header className="flex flex-col items-center mb-12" role="banner">
        <nav 
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          aria-label="Navegación principal"
        >
          <Link to="/InsertBook" aria-label={MESSAGES.aria.backToHome}>
            <Button 
              className="bg-[#EE6C4D] hover:bg-[#d95b3d] text-white border-2 border-[#293241] shadow-md transition-colors"
              aria-label="Ir a la página de insertar nuevo libro"
            >
              Agregar Libro
            </Button>
          </Link>
          <BookSearch 
            books={books} 
            onSearchChange={setSearchTerm}
            aria-label={MESSAGES.aria.searchBooks}
          />
        </nav>
        
        {/* h1 visible - título principal de la página */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#293241]">
          Libros Disponibles
        </h1>
        <p className="text-center text-[#293241]/70 max-w-2xl">
          Descubre nuestra colección de libros de los mejores autores y editoriales
        </p>
      </header>

      {/* Grid de libros */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl mx-auto"
        aria-label={MESSAGES.aria.bookCatalog}
        role="region"
      >
        {filteredBooks.map((book) => {
          const authorName = getAuthorNameById(book.author_id, authorMap);
          
          return (
            <article
              key={book.id}
              onClick={() => handleBookClick(book)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleBookClick(book);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={MESSAGES.aria.bookCard(book.title)}
              className="border-2 border-[#293241] rounded-lg cursor-pointer p-6 bg-[#FFD9A0] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-[580px] w-full flex flex-col focus:outline-none focus:ring-4 focus:ring-[#EE6C4D]/50"
            >
              {/* Imagen con altura fija */}
              <figure className="w-full h-72 flex-shrink-0 mb-4">
                <img
                  src={book.cover}
                  alt={MESSAGES.aria.bookCover(book.title, authorName)}
                  className="w-full h-full object-cover rounded-md shadow-md"
                  loading="lazy"
                />
              </figure>
              
              {/* Contenido con flex-grow para ocupar espacio disponible */}
              <div className="flex flex-col flex-grow">
                <header className="flex items-start gap-2 flex-wrap mb-2">
                  <h2 className="text-lg font-bold text-[#293241] flex-1 line-clamp-2">
                    {book.title}
                  </h2>
                  {book.is_best_seller && (
                    <span
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold flex-shrink-0"
                      role="status"
                      aria-label={MESSAGES.aria.bestSeller}
                    >
                      ⭐ Best Seller
                    </span>
                  )}
                </header>

                <dl className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-[#293241]/80">
                    <dt className="sr-only">Autor</dt>
                    <span aria-hidden="true">✍️</span>
                    <dd className="truncate">{authorName}</dd>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#293241]/80">
                    <dt className="sr-only">Edición</dt>
                    <span aria-hidden="true">📖</span>
                    <dd className="truncate">{book.edition}</dd>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#293241]/80">
                    <dt className="sr-only">Año de publicación</dt>
                    <span aria-hidden="true">📅</span>
                    <dd>{book.year}</dd>
                  </div>
                </dl>

                <div className="text-sm text-[#293241]/70 flex-grow mt-2">
                  <p className="line-clamp-2">{book.description}</p>
                </div>
              </div>

              {/* Precio siempre al fondo */}
              <footer className="w-full flex justify-between items-center mt-auto pt-4 border-t border-[#293241]/20">
                <span className="text-xs text-[#293241]/60">Precio:</span>
                <p className="text-xl text-right font-bold text-[#EE6C4D]" aria-label={`Precio: ${book.price} dólares`}>
                  ${book.price} USD
                </p>
              </footer>
            </article>
          );
        })}
      </section>

      {/* Estado vacío */}
      {filteredBooks.length === 0 && (
        <div 
          className="text-center py-16"
          role="status"
          aria-live="polite"
        >
          <p className="text-xl text-[#293241]/60">
            No se encontraron libros que coincidan con tu búsqueda
          </p>
        </div>
      )}

      {/* Modal de detalles del libro */}
      <BookModal
        book={selectedBook}
        authorName={
          selectedBook
            ? getAuthorNameById(selectedBook.author_id, authorMap)
            : ""
        }
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
