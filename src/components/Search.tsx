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
        className="flex items-center gap-2 rounded-sm raduis px-3 py-2 bg-white shadow cursor-pointer w-full max-w-xs"
        onClick={() => setOpen(true)}
        tabIndex={0}
        role="button"
        aria-label="Buscar libro"
      >
        <SearchIcon className="w-4 h-4 text-gray-500" />
        <span className="text-gray-500 text-sm flex-1 text-left select-none">
          Presiona{" "}
          <kbd className="bg-gray-100 px-1 rounded border text-xs">
            Ctrl + K
          </kbd>{" "}
          para buscar
        </span>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar libro por título..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No hay resultados.</CommandEmpty>
          <CommandGroup heading="Libros">
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
