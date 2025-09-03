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

      // Parse the stringified JSON returned from backend
      const parsedData = typeof result.data === "string" ? JSON.parse(result.data) : result.data;
      setData(parsedData);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-8 font-sans">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-pink-700">
          🍳 Chutki Recipe Extractor
        </h1>

        {/* Upload form */}
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto flex flex-col items-center space-y-4"
        >
          <input
              type="file"
              accept=".txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border rounded px-3 py-2 w-full"
          />
          <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700 transition"
          >
            {loading ? "Processing..." : "Upload Recipe File"}
          </button>
        </form>

        {/* Error */}
        {error && (
            <p className="text-red-600 text-center mt-4 font-medium">⚠️ {error}</p>
        )}

        {/* Recipe Display */}
        {data && (
            <section className="bg-white shadow-2xl rounded-2xl p-8 mt-8 max-w-3xl mx-auto">
              {/* Recipe Title */}
              <h2 className="text-3xl font-bold mb-4 text-pink-700">
                {data.name || "Extracted Recipe"}
              </h2>

              {/* Ingredients */}
              {data.ingredients && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">🛒 Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {data.ingredients.map((ing: string, idx: number) => (
                          <li key={idx} className="text-gray-700">{ing}</li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Steps */}
              {data.steps && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">👩‍🍳 Steps</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {data.steps.map((step: string, idx: number) => (
                          <li key={idx} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                  </div>
              )}
            </section>
        )}
      </main>
  );
}
