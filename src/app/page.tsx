"use client";
import { useState } from "react";

interface Product {
  name: string;
  price: string;
  description?: string;
  category?: string;
  sku?: string;
}

interface ProductCatalogData {
  products: Product[];
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ProductCatalogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a .txt file");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      const parsedData =
          typeof result.data === "string" ? JSON.parse(result.data) : result.data;
      setData(parsedData);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8 font-sans">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-700">
          🛍️ Product Catalog Extractor
        </h1>

        {/* Upload form */}
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-xl p-8 max-w-lg mx-auto space-y-6"
        >
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition">
            <span className="text-blue-600 font-medium">
              {file ? `📄 ${file.name}` : "Click to select a .txt file"}
            </span>
            <input
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
            />
          </label>

          <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition transform ${
                  loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }`}
          >
            {loading ? "⏳ Processing..." : "Upload & Extract Catalog"}
          </button>
        </form>

        {/* Error */}
        {error && (
            <p className="text-red-600 text-center mt-4 font-medium">⚠️ {error}</p>
        )}

        {/* Catalog Display */}
        {data && data.products.length > 0 && (
            <section className="bg-white shadow-2xl rounded-2xl p-8 mt-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-blue-700">
                Extracted Product Catalog
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                  <tr className="bg-blue-100">
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Price</th>
                    <th className="border px-4 py-2 text-left">Description</th>
                    <th className="border px-4 py-2 text-left">Category</th>
                  </tr>
                  </thead>
                  <tbody>
                  {data.products.map((product, idx) => (
                      <tr key={idx} className="even:bg-blue-50">
                        <td className="border px-4 py-2">{product.name}</td>
                        <td className="border px-4 py-2">{product.price}</td>
                        <td className="border px-4 py-2">{product.description || "-"}</td>
                        <td className="border px-4 py-2">{product.category || "-"}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </section>
        )}
      </main>
  );
}
