"use client";
import { useState } from "react";

interface RecipeData {
  name?: string;
  ingredients?: string[];
  steps?: string[];
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<RecipeData | null>(null);
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
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-8 font-sans">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-orange-700">
          🍳 Chutki Recipe Extractor
        </h1>

        {/* Upload form */}
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-xl p-8 max-w-lg mx-auto space-y-6"
        >
          {/* File Upload Styled */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-400 rounded-lg cursor-pointer hover:bg-orange-50 transition">
          <span className="text-orange-600 font-medium">
            {file ? `📄 ${file.name}` : "Click to select a .txt file"}
          </span>
            <input
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
            />
          </label>

          {/* Submit Button */}
          <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition transform ${
                  loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700 active:scale-95"
              }`}
          >
            {loading ? "⏳ Processing..." : "Upload & Extract Recipe"}
          </button>
        </form>

        {/* Error */}
        {error && (
            <p className="text-red-600 text-center mt-4 font-medium">⚠️ {error}</p>
        )}

        {/* Recipe Display */}
        {data && (
            <section className="bg-white shadow-2xl rounded-2xl p-8 mt-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-orange-700">
                {data.name || "Extracted Recipe"}
              </h2>

              {data.ingredients && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">🛒 Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {data.ingredients.map((ing: string, idx: number) => (
                          <li key={idx} className="text-gray-700">
                            {ing}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {data.steps && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">👩‍🍳 Steps</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {data.steps.map((step: string, idx: number) => (
                          <li key={idx} className="text-gray-700">
                            {step}
                          </li>
                      ))}
                    </ol>
                  </div>
              )}
            </section>
        )}
      </main>
  );
}
