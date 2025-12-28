import type { Book } from "@/types/book";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

interface BookModalProps {
  book: Book | null;
  authorName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para mostrar información detallada de un libro
 * Mejora UX al permitir ver toda la información sin saturar la card
 */
export function BookModal({ book, authorName, isOpen, onClose }: BookModalProps) {
  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FFF8ED] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        aria-labelledby="book-modal-title"
        aria-describedby="book-modal-description"
      >
        <DialogHeader>
          <DialogTitle 
            id="book-modal-title"
            className="text-3xl font-bold text-[#293241]"
          >
            {book.title}
          </DialogTitle>
          <DialogDescription 
            id="book-modal-description"
            className="text-[#293241]/70"
          >
            {book.is_best_seller && (
              <span 
                className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mr-2"
                role="status"
                aria-label="Este libro es un Best Seller"
              >
                ⭐ Best Seller
              </span>
            )}
            Por {authorName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4" role="region" aria-label="Detalles del libro">
          {/* Imagen */}
          <figure className="flex justify-center">
            <img
              src={book.cover}
              alt={`Portada del libro ${book.title} por ${authorName}`}
              className="w-full max-w-sm h-auto object-cover rounded-lg shadow-lg border-2 border-[#293241]"
            />
          </figure>

          {/* Información */}
          <div className="space-y-4 text-[#293241]">
            <div>
              <h3 className="text-sm font-semibold text-[#201A17] uppercase tracking-wide">
                Descripción
              </h3>
              <p className="mt-1 text-base leading-relaxed">{book.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-[#201A17] uppercase">
                  Edición
                </h4>
                <p className="text-sm">{book.edition}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#201A17] uppercase">
                  Año
                </h4>
                <p className="text-sm">{book.year}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#201A17] uppercase">
                  ISBN
                </h4>
                <p className="text-sm">{book.isbn}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#201A17] uppercase">
                  Rating
                </h4>
                <p className="text-sm">⭐ {book.rating}/5</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-[#201A17] uppercase">
                  Stock
                </h4>
                <p className="text-sm">{book.stock} disponibles</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#201A17] uppercase">
                  Ventas
                </h4>
                <p className="text-sm">{book.sales} vendidos</p>
              </div>
            </div>

            {book.discount > 0 && (
              <div className="bg-[#FFD9A0] p-3 rounded-lg border border-[#EE6C4D]">
                <h4 className="text-xs font-semibold text-[#201A17] uppercase">
                  Descuento
                </h4>
                <p className="text-lg font-bold text-[#EE6C4D]">{book.discount}% OFF</p>
              </div>
            )}

            <div className="pt-4 border-t border-[#293241]/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#293241]/70">Precio:</span>
                <span 
                  className="text-3xl font-bold text-[#EE6C4D]"
                  aria-label={`Precio: ${book.price} dólares`}
                >
                  ${book.price} USD
                </span>
              </div>

              <InteractiveHoverButton 
                className="w-full bg-[#EE6C4D] hover:bg-[#d95b3d] text-white border-2 border-[#293241]"
                aria-label={`Comprar el libro ${book.title} por ${book.price} dólares`}
              >
                Comprar Ahora
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
