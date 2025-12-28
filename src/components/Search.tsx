import { useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search as SearchIcon } from "lucide-react";
import type { Book } from "@/types/book";

interface BookSearchProps {
  books: Book[];
  onSearchChange?: (term: string) => void;
}

export function BookSearch({ books, onSearchChange }: BookSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Notificar el término de búsqueda al padre
  useEffect(() => {
    onSearchChange?.(search);
  }, [search, onSearchChange]);

  const filteredBooks = useMemo(() => {
    if (!search.trim()) return books;
    return books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  return (
    <>
      <div
        className="flex items-center gap-2 rounded-md px-4 py-2 bg-white border-2 border-[#293241] shadow-md cursor-pointer w-full max-w-xs hover:shadow-lg transition-shadow"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Abrir búsqueda de libros. Presiona Ctrl+K como atajo"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <SearchIcon className="w-4 h-4 text-[#293241]" aria-hidden="true" />
        <span className="text-[#293241]/70 text-sm flex-1 text-left select-none">
          Presiona{" "}
          <kbd className="bg-[#FFD9A0] px-1.5 py-0.5 rounded border border-[#293241] text-xs font-semibold">
            Ctrl + K
          </kbd>{" "}
          para buscar
        </span>
      </div>
      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        aria-label="Buscar libros"
      >
        <CommandInput
          placeholder="Buscar libro por título..."
          value={search}
          onValueChange={setSearch}
          aria-label="Escribe el título del libro que buscas"
        />
        <CommandList aria-label="Resultados de búsqueda">
          <CommandEmpty role="status" aria-live="polite">No hay resultados.</CommandEmpty>
          <CommandGroup heading="Libros" aria-label="Lista de libros encontrados">
            {filteredBooks.map((book) => (
              <CommandItem
                key={book.id}
                onSelect={() => {
                  setOpen(false);
                  setSearch("");
                }}
                className="flex justify-between"
              >
                <span>{book.title}</span>
                <span className="text-xs text-gray-500">{book.year}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
