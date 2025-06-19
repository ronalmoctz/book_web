import { useState, useMemo } from "react";
import { useFetch } from "./hooks/useFetch";
import type { Book } from "./types/book";
import type { Author } from "./types/author";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";
import { BookSearch } from "@/components/Search";

export default function BookList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data = [], loading, error } = useFetch<Book[]>("/books", []);
  const {
    data: authors = [],
    loading: la,
    error: ea,
  } = useFetch<Author[]>("/authors", []);

  const authorMap = useMemo(() => {
    const m = new Map<number, string>();
    (authors ?? []).forEach((a) => m.set(a.id, `${a.name} ${a.last_name}`));
    return m;
  }, [authors]);

  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return (data || []).filter((b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading || la)
    return <p className="text-center mt-10">Cargando libros...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error: {error.message}</p>
    );
  if (ea)
    return (
      <p className="text-center mt-10 text-red-500">
        Error autores: {ea.message}
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col  p-10">
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center gap-4">
          <Link to="/InsertBook">
            <Button className="cursor-pointer">Insertar Libro</Button>
          </Link>
          <BookSearch books={data || []} onSearchChange={setSearchTerm} />
        </div>
        <h2 className="text-5xl font-semibold mb-20 text-center mt-10">
          Libros disponibles
        </h2>
      </div>
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
        {(filteredBooks || []).map((book) => (
          <div key={book.id} className="flex flex-col items-center">
            <div className="border-2 border-gray-900 rounded-md cursor-pointer p-6 flex flex-col items-center relative bg-white shadow-md w-full">
              <img
                src={book.cover}
                alt={book.title}
                className="w-60 h-80 object-cover mb-4 rounded-sm "
              />
              <div className="w-full space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 mt-1"></span>
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  {book.is_best_seller && (
                    <span className="text-xs text-green-500 font-bold">
                      Best Seller ⭐
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>•</span>
                  <p>{authorMap.get(book.author_id) ?? "Autor desconocido"}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>•</span>
                  <p>{book.edition}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>•</span>
                  <p>{book.year}</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <p className="line-clamp-3">{book.description}</p>
                </div>
              </div>
              <div className="w-full flex justify-between items-center mt-4">
                <span></span>
                <p className="text-base text-right font-medium">
                  <span className="mr-1">🪙</span>
                  {book.price} USD
                </p>
              </div>
            </div>
            <div className="mt-2 w-full">
              <InteractiveHoverButton className="w-full border-2 border-gray-900">
                Comprar
              </InteractiveHoverButton>
            </div>
          </div>
        ))}
      </article>
    </div>
  );
}
