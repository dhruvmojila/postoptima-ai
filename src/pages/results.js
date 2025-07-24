import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthGuard } from "../lib/authGuard";
export default function Results() {
  const [data, setData] = useState(null);
  const { user, loading } = useAuthGuard();
  useEffect(() => {
    const stored = localStorage.getItem("latestAnalysis");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;

  if (!data) return <p className="text-center py-10 text-white">No results.</p>;

  console.log(data);

  return (
    <main className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">📊 AI Analysis Results</h2>

        <div className="mb-4">
          <p>
            <span className="font-semibold">Original:</span> {data.original}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <span className="font-semibold">Optimized:</span>{" "}
            {data.optimized_content}
          </p>
        </div>
        <div className="mb-2">
          <p>
            <span className="font-semibold">Algorithm Score:</span>{" "}
            {data.algorithm_score}/100
          </p>
          <p>
            <span className="font-semibold">Engagement Prediction:</span>{" "}
            {data.engagement_prediction}/100
          </p>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Suggestions:</h4>
          <ul className="list-disc list-inside text-gray-300">
            {data.suggestions?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </main>
  );
}
