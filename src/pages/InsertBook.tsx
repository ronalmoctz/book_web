import React, { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { FileUpload } from "@/components/ui/FileUpload";
import { useBookFormData } from "@/hooks/useBooks";
import { usePost } from "@/hooks/usePost";
import { useBookForm } from "@/hooks/useBookForm";
import type { Book } from "@/types/book";
import { Link } from "react-router-dom";

export const InsertBook: React.FC = () => {
  const { 
    form, 
    setFieldValue, 
    handleChange, 
    handleBlur, 
    getError, 
    validateAll,
    resetForm 
  } = useBookForm();
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { authors, genres, publishers, loading, error: loadError } = useBookFormData();
  const { post, loading: posting } = usePost<Book>("/books");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateAll()) {
      setSubmitError("Por favor corrige los errores en el formulario");
      return;
    }

    if (!coverFile) {
      setSubmitError("Selecciona una portada para el libro");
      return;
    }
    
    const data = new FormData();
    data.append("cover", coverFile);
    data.append("payload", JSON.stringify(form));
    
    try {
      await post(data);
      setSubmitSuccess(true);
      resetForm();
      setCoverFile(null);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al crear el libro");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#EE6C4D] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#293241] text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center">
        <div className="text-center p-8 bg-red-100 rounded-lg border-2 border-red-500">
          <p className="text-red-600 text-lg">Error al cargar datos: {loadError.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#EE6C4D] text-white"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8ED] p-4 md:p-8">
      {/* Botón Volver */}
      <Link to="/" className="fixed left-4 top-4 z-10">
        <Button className="bg-[#EE6C4D] hover:bg-[#d95b3d] text-white border-2 border-[#293241] shadow-lg">
          ← Volver
        </Button>
      </Link>

      {/* Contenedor principal - Layout horizontal en desktop */}
      <div className="max-w-7xl mx-auto mt-16 md:mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#293241] mb-8">
          📚 Agregar Nuevo Libro
        </h1>

        {/* Mensajes de estado */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-500 rounded-lg text-green-700 text-center max-w-2xl mx-auto">
            ✅ Libro creado exitosamente!
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-500 rounded-lg text-red-700 text-center max-w-2xl mx-auto">
            ❌ {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Layout: 2 columnas en desktop (Formulario | Preview) */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* COLUMNA IZQUIERDA: Campos del formulario */}
            <div className="flex-1 space-y-6">
              
              {/* Fila 1: Info Básica */}
              <section className="bg-[#FFD9A0] rounded-xl p-6 border-2 border-[#293241] shadow-lg">
                <h2 className="text-lg font-semibold text-[#293241] mb-4 border-b border-[#293241]/20 pb-2">
                  Información Básica
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    id="title"
                    label="Título"
                    name="title"
                    placeholder="Ingresa el título"
                    onChange={handleChange}
                    onBlur={() => handleBlur("title")}
                    error={getError("title")}
                  />
                  <FormField
                    id="isbn"
                    label="ISBN"
                    name="isbn"
                    placeholder="978-3-16-148410-0"
                    onChange={handleChange}
                    onBlur={() => handleBlur("isbn")}
                    error={getError("isbn")}
                  />
                </div>
                <div className="mt-4">
                  <FormField
                    id="description"
                    label="Descripción"
                    name="description"
                    placeholder="Describe el contenido del libro..."
                    minLength={10}
                    onChange={handleChange}
                    onBlur={() => handleBlur("description")}
                    error={getError("description")}
                  />
                </div>
              </section>

              {/* Fila 2: Edición y Clasificación */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Detalles de Edición */}
                <section className="bg-[#FFD9A0] rounded-xl p-6 border-2 border-[#293241] shadow-lg">
                  <h2 className="text-lg font-semibold text-[#293241] mb-4 border-b border-[#293241]/20 pb-2">
                    Edición
                  </h2>
                  <div className="space-y-4">
                    <FormField
                      id="year"
                      label="Año"
                      name="year"
                      type="number"
                      min={1900}
                      max={new Date().getFullYear() + 1}
                      onChange={handleChange}
                      onBlur={() => handleBlur("year")}
                      error={getError("year")}
                    />
                    <FormField
                      id="edition"
                      label="Edición"
                      name="edition"
                      placeholder="Primera Edición"
                      onChange={handleChange}
                      onBlur={() => handleBlur("edition")}
                      error={getError("edition")}
                    />
                  </div>
                </section>

                {/* Precio */}
                <section className="bg-[#FFD9A0] rounded-xl p-6 border-2 border-[#293241] shadow-lg">
                  <h2 className="text-lg font-semibold text-[#293241] mb-4 border-b border-[#293241]/20 pb-2">
                    Precio
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      id="price"
                      label="USD"
                      name="price"
                      type="number"
                      step="0.01"
                      min={0.01}
                      max={10000}
                      placeholder="0.00"
                      onChange={handleChange}
                      onBlur={() => handleBlur("price")}
                      error={getError("price")}
                    />
                    <FormField
                      id="discount"
                      label="Descuento %"
                      name="discount"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0"
                      onChange={handleChange}
                      onBlur={() => handleBlur("discount")}
                      error={getError("discount")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      id="stock"
                      label="Stock"
                      name="stock"
                      type="number"
                      min={0}
                      placeholder="0"
                      onChange={handleChange}
                      onBlur={() => handleBlur("stock")}
                      error={getError("stock")}
                    />
                    <FormField
                      id="sales"
                      label="Ventas"
                      name="sales"
                      type="number"
                      min={0}
                      placeholder="0"
                      onChange={handleChange}
                      onBlur={() => handleBlur("sales")}
                      error={getError("sales")}
                    />
                  </div>
                </section>
              </div>

              {/* Fila 3: Clasificación */}
              <section className="bg-[#FFD9A0] rounded-xl p-6 border-2 border-[#293241] shadow-lg">
                <h2 className="text-lg font-semibold text-[#293241] mb-4 border-b border-[#293241]/20 pb-2">
                  Clasificación
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <SelectField
                    id="author_id"
                    label="Autor"
                    placeholder="Selecciona"
                    groupLabel="Autores"
                    options={authors}
                    value={form.author_id}
                    error={getError("author_id")}
                    onChange={(val) => {
                      setFieldValue("author_id", val);
                      handleBlur("author_id");
                    }}
                  />
                  <SelectField
                    id="genre_id"
                    label="Género"
                    placeholder="Selecciona"
                    groupLabel="Géneros"
                    options={genres}
                    value={form.genre_id}
                    error={getError("genre_id")}
                    onChange={(val) => {
                      setFieldValue("genre_id", val);
                      handleBlur("genre_id");
                    }}
                  />
                  <SelectField
                    id="publisher_id"
                    label="Editorial"
                    placeholder="Selecciona"
                    groupLabel="Editoriales"
                    options={publishers}
                    value={form.publisher_id}
                    error={getError("publisher_id")}
                    onChange={(val) => {
                      setFieldValue("publisher_id", val);
                      handleBlur("publisher_id");
                    }}
                  />
                </div>
              </section>

              {/* Fila 4: Rating */}
              <section className="bg-[#FFD9A0] rounded-xl p-6 border-2 border-[#293241] shadow-lg">
                <h2 className="text-lg font-semibold text-[#293241] mb-4 border-b border-[#293241]/20 pb-2">
                  Rating
                </h2>
                <div className="flex flex-wrap gap-6 items-end">
                  <div className="w-32">
                    <FormField
                      id="rating"
                      label="Puntuación (0-5)"
                      name="rating"
                      type="number"
                      step="0.1"
                      min={0}
                      max={5}
                      placeholder="0.0"
                      onChange={handleChange}
                      onBlur={() => handleBlur("rating")}
                      error={getError("rating")}
                    />
                  </div>
                  <ToggleSwitch
                    id="is_best_seller"
                    label="¿Best Seller?"
                    checked={form.is_best_seller}
                    onChange={(checked) => setFieldValue("is_best_seller", checked)}
                  />
                </div>
              </section>
            </div>

            {/* COLUMNA DERECHA: Preview de portada y botón submit */}
            <div className="lg:w-96 space-y-6">
              
              {/* Portada */}
              <section className="bg-[#FFD9A0] rounded-xl p-6 border-2 border-[#293241] shadow-lg sticky top-4">
                <h2 className="text-lg font-semibold text-[#293241] mb-4 border-b border-[#293241]/20 pb-2">
                  📷 Portada del Libro
                </h2>
                <FileUpload
                  id="cover"
                  label="Imagen (PNG/JPG, máx 1MB)"
                  accept="image/png,image/jpeg"
                  maxSizeMB={1}
                  onFileChange={setCoverFile}
                  error={!coverFile && submitError?.includes("portada") ? "Selecciona una portada" : undefined}
                />

                {/* Preview ampliado */}
                {coverFile && (
                  <div className="mt-4 p-4 bg-white rounded-lg border-2 border-[#293241]">
                    <img
                      src={URL.createObjectURL(coverFile)}
                      alt="Preview de portada"
                      className="w-full h-auto max-h-80 object-contain rounded-md"
                    />
                  </div>
                )}

                {/* Botón Submit */}
                <Button
                  type="submit"
                  disabled={posting}
                  className="w-full mt-6 bg-[#EE6C4D] hover:bg-[#d95b3d] text-white font-bold text-lg py-5 
                    border-2 border-[#293241] shadow-xl transition-all duration-200 
                    hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {posting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Guardando...
                    </span>
                  ) : (
                    "📖 Guardar Libro"
                  )}
                </Button>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
