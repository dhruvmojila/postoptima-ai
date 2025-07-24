import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          🚀 PostOptima AI
        </h1>
        <p className="text-xl sm:text-2xl max-w-xl mx-auto mb-6 text-gray-300">
          Know your post's performance before it goes live. AI-powered
          predictions for Twitter, Instagram, Facebook, LinkedIn.
        </p>
        <Link href="/dashboard">
          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white text-lg font-medium shadow-lg transition">
            Analyze My Content
          </button>
        </Link>
      </motion.div>
    </main>
  );
}
