import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { usePost } from "@/hooks/usePost";
import type { Book } from "@/types/book";
import { Link } from "react-router-dom";

// Tipos para selects
interface Author {
  id: number;
  name: string;
  last_name: string;
}
interface Genre {
  id: number;
  name: string;
}
interface Publisher {
  id: number;
  name: string;
}

type BookForm = Omit<Book, "id" | "create_at" | "update_at">;

export const InsertBook: React.FC = () => {
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
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Validación de campos vacíos individuales
  const [touched, setTouched] = useState<{ [K in keyof BookForm]?: boolean }>(
    {}
  );
  const getError = (key: keyof BookForm) => {
    if (!touched[key]) return "";
    const value = form[key];
    if (typeof value === "string" && value.trim() === "")
      return "* Este campo es obligatorio";
    if (typeof value === "number" && value === 0)
      return "* Este campo es obligatorio";
    return "";
  };

  // Fetch dinámico para selects
  const { data: authors, loading: loadingAuthors } =
    useFetch<Author[]>("/authors");
  const { data: genres, loading: loadingGenres } = useFetch<Genre[]>("/genres");
  const { data: publishers, loading: loadingPublishers } =
    useFetch<Publisher[]>("/publishers");

  const { post, loading: posting, error } = usePost<Book>("/books");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setForm((f) => ({
      ...f,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCoverFile(e.target.files[0]);
  };

  // Validación de campos vacíos
  const isEmpty = Object.entries(form).some(
    ([key, value]) =>
      key !== "cover" && // cover se valida aparte
      (typeof value === "string" ? value.trim() === "" : value === 0)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coverFile) return alert("Selecciona una portada");
    if (isEmpty) return alert("Todos los campos son obligatorios");
    const data = new FormData();
    data.append("cover", coverFile);
    data.append("payload", JSON.stringify(form));
    try {
      await post(data);
      alert("Libro creado!");
    } catch {
      alert("Error al crear libro");
    }
  };

  if (loadingAuthors || loadingGenres || loadingPublishers)
    return <p>Cargando...</p>;

  return (
    <div className="mt-10">
      <Link to="/" className="absolute left-4 top-4 ">
        <Button className="cursor-pointer">Volver</Button>
      </Link>
      <section className="max-w-lg mx-auto p-6 bg-white rounded shadow space-y-4 relative">
        <h3 className="text-2xl font-semibold text-center">Agregar Libro</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              required
            />
            {getError("title") && (
              <span className="text-red-600 text-sm">{getError("title")}</span>
            )}
          </div>
          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              required
            />
            {getError("description") && (
              <span className="text-red-600 text-sm">
                {getError("description")}
              </span>
            )}
          </div>
          {/* Precio / Descuento */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, price: true }))}
                required
              />
              {getError("price") && (
                <span className="text-red-600 text-sm">
                  {getError("price")}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="discount">Descuento %</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, discount: true }))}
                required
              />
              {getError("discount") && (
                <span className="text-red-600 text-sm">
                  {getError("discount")}
                </span>
              )}
            </div>
          </div>
          {/* Rating / Best Seller */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, rating: true }))}
                required
              />
              {getError("rating") && (
                <span className="text-red-600 text-sm">
                  {getError("rating")}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input
                id="is_best_seller"
                name="is_best_seller"
                type="checkbox"
                onChange={handleChange}
                onBlur={() =>
                  setTouched((t) => ({ ...t, is_best_seller: true }))
                }
                required
              />
              <Label htmlFor="is_best_seller">Best Seller</Label>
              {getError("is_best_seller") && (
                <span className="text-red-600 text-sm">
                  {getError("is_best_seller")}
                </span>
              )}
            </div>
          </div>
          {/* Portada */}
          <div>
            <Label htmlFor="cover">Portada (PNG/JPG &lt;1 MB)</Label>
            <Input
              id="cover"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFile}
              onBlur={() => setTouched((t) => ({ ...t, cover: true }))}
              required
            />
            {touched.cover && !coverFile && (
              <span className="text-red-600 text-sm">
                * Este campo es obligatorio
              </span>
            )}
          </div>
          {/* Año / Edición / ISBN */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                name="year"
                type="number"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, year: true }))}
                required
              />
              {getError("year") && (
                <span className="text-red-600 text-sm">{getError("year")}</span>
              )}
            </div>
            <div>
              <Label htmlFor="edition">Edición</Label>
              <Input
                id="edition"
                name="edition"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, edition: true }))}
                required
              />
              {getError("edition") && (
                <span className="text-red-600 text-sm">
                  {getError("edition")}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, isbn: true }))}
                required
              />
              {getError("isbn") && (
                <span className="text-red-600 text-sm">{getError("isbn")}</span>
              )}
            </div>
          </div>
          {/* Stock / Ventas */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, stock: true }))}
                required
              />
              {getError("stock") && (
                <span className="text-red-600 text-sm">
                  {getError("stock")}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="sales">Ventas</Label>
              <Input
                id="sales"
                name="sales"
                type="number"
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, sales: true }))}
                required
              />
              {getError("sales") && (
                <span className="text-red-600 text-sm">
                  {getError("sales")}
                </span>
              )}
            </div>
          </div>
          {/* Autor */}
          <div>
            <Label htmlFor="author_id">Autor</Label>
            <Select
              value={form.author_id ? form.author_id.toString() : ""}
              onValueChange={(val) => {
                setForm((f) => ({ ...f, author_id: Number(val) }));
                setTouched((t) => ({ ...t, author_id: true }));
              }}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un autor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Autores</SelectLabel>
                  {(authors ?? []).map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      {a.name} {a.last_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {getError("author_id") && (
              <span className="text-red-600 text-sm">
                {getError("author_id")}
              </span>
            )}
          </div>
          {/* Género */}
          <div>
            <Label htmlFor="genre_id">Género</Label>
            <Select
              value={form.genre_id ? form.genre_id.toString() : ""}
              onValueChange={(val) => {
                setForm((f) => ({ ...f, genre_id: Number(val) }));
                setTouched((t) => ({ ...t, genre_id: true }));
              }}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un género" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Géneros</SelectLabel>
                  {(genres ?? []).map((g) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {getError("genre_id") && (
              <span className="text-red-600 text-sm">
                {getError("genre_id")}
              </span>
            )}
          </div>
          {/* Editorial */}
          <div>
            <Label htmlFor="publisher_id">Editorial</Label>
            <Select
              value={form.publisher_id ? form.publisher_id.toString() : ""}
              onValueChange={(val) => {
                setForm((f) => ({ ...f, publisher_id: Number(val) }));
                setTouched((t) => ({ ...t, publisher_id: true }));
              }}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una editorial" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Editoriales</SelectLabel>
                  {(publishers ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {getError("publisher_id") && (
              <span className="text-red-600 text-sm">
                {getError("publisher_id")}
              </span>
            )}
          </div>
          {/* Botón enviar */}
          <Button type="submit" disabled={posting}>
            {posting ? "Enviando…" : "Guardar Libro"}
          </Button>
          {error && <p className="mt-2 text-red-600">{error.message}</p>}
        </form>
      </section>
    </div>
  );
};
