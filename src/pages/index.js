import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.5, 0.8, 1],
        opacity: [0.2, 0.6, 0.3, 0.2],
      }}
      transition={{
        duration: 8 + i * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.5,
      }}
      style={{
        left: `${10 + i * 12}%`,
        top: `${20 + (i % 3) * 25}%`,
      }}
    />
  ));

  return (
    <>
      <Head>
        <title>
          PostOptima AI - Predict Social Media Performance Before You Post
        </title>
      </Head>
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.3),transparent)]" />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingElements}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          {/* Glassmorphism Container */}
          <motion.div
            className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto text-center shadow-2xl"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 50,
              scale: isVisible ? 1 : 0.9,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur opacity-20" />

            {/* Content */}
            <div className="relative">
              {/* Animated Logo/Icon */}
              <motion.div
                className="text-6xl sm:text-7xl mb-6 inline-block"
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                🚀
              </motion.div>

              {/* Main Title with Gradient */}
              <motion.h1
                className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                PostOptima AI
              </motion.h1>

              {/* Subtitle with Typewriter Effect */}
              <motion.p
                className="text-xl sm:text-2xl max-w-3xl mx-auto mb-8 text-gray-200 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Know your post&apos;s performance{" "}
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent font-semibold">
                  before it goes live
                </span>
                . AI-powered predictions for Twitter, Instagram, Facebook,
                LinkedIn.
              </motion.p>

              {/* CTA Button with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link href="/dashboard">
                  <motion.button
                    className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 px-8 py-4 rounded-2xl text-white text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      Analyze My Content
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                    </span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                className="flex flex-wrap justify-center gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {[
                  "Real-time Analysis",
                  "Algorithm Insights",
                  "Performance Prediction",
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-gray-200"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.15)",
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  >
                    {feature}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Decorative Elements */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Additional SEO Content (Hidden but crawlable) */}
        <div className="sr-only">
          <h2>AI-Powered Social Media Content Optimization</h2>
          <p>
            PostOptima AI revolutionizes content creation by providing real-time
            algorithmic compatibility scores and engagement predictions for
            social media posts across Twitter, Instagram, Facebook, and LinkedIn
            platforms.
          </p>
          <h3>Key Features</h3>
          <ul>
            <li>Pre-publish performance analysis</li>
            <li>Algorithm compatibility scoring</li>
            <li>Engagement prediction technology</li>
            <li>Multi-platform optimization</li>
            <li>Real-time content insights</li>
          </ul>
        </div>
      </main>
    </>
  );
}
