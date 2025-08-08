import { useEffect, useState, useRef, memo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useAuthGuard } from "@/lib/authGuard";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Target,
  Calendar,
  Sparkles,
  Activity,
} from "lucide-react";

// Memoized StatCard component (moved outside to prevent re-creation)
const StatCard = memo(
  ({ icon: Icon, title, value, subtitle, color = "blue", delay = 0 }) => (
    <motion.div
      className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg group hover:bg-white/8 transition-colors duration-200 overflow-hidden transform-gpu will-change-transform"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
    >
      {/* Static glow - no animation to avoid repaints */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-${color}-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-15 pointer-events-none`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-r from-${color}-500/20 to-purple-500/20 border border-${color}-500/30`}
          >
            <Icon className={`h-6 w-6 text-${color}-400`} />
          </div>
          {/* Reduced animation - single sparkle with opacity pulse instead of rotation */}
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
          >
            ✨
          </motion.div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-300 text-sm">{title}</p>
        {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )
);

StatCard.displayName = "StatCard";

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const rafRef = useRef(null);

  // Use motion values for smooth mouse tracking without React re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create smooth gradient background with motion template
  const backgroundGradient = useMotionTemplate`radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`;

  const router = useRouter();
  const { user, loading: authLoading } = useAuthGuard();

  useEffect(() => {
    // Optimized mouse move handler with requestAnimationFrame throttling
    const handleMouseMove = (e) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        mouseX.set(x);
        mouseY.set(y);

        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data: analyticsData, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setData(analyticsData);
      setLoading(false);
    };

    if (user) fetchHistory();
  }, [user]);

  const formatted = data.map((d) => ({
    date: new Date(d.created_at).toLocaleDateString(),
    engagement: d.engagement_prediction,
    score: d.algorithm_score,
  }));

  // Calculate stats
  const avgEngagement =
    data.length > 0
      ? (
          data.reduce((acc, item) => acc + item.engagement_prediction, 0) /
          data.length
        ).toFixed(1)
      : 0;

  const avgScore =
    data.length > 0
      ? (
          data.reduce((acc, item) => acc + item.algorithm_score, 0) /
          data.length
        ).toFixed(1)
      : 0;

  const bestPerforming =
    data.length > 0
      ? data.reduce(
          (max, item) =>
            item.engagement_prediction > max.engagement_prediction ? item : max,
          data[0]
        )
      : null;

  const platformStats = data.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {});

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: "🐦",
      instagram: "📷",
      facebook: "👥",
      linkedin: "💼",
    };
    return icons[platform] || "📱";
  };

  const getPlatformColor = (platform) => {
    const colors = {
      twitter: "from-blue-400 to-blue-600",
      instagram: "from-pink-400 to-purple-600",
      facebook: "from-blue-500 to-indigo-600",
      linkedin: "from-blue-600 to-blue-800",
    };
    return colors[platform] || "from-gray-400 to-gray-600";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full" />
          <div
            className="absolute inset-2 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>
          Analytics Dashboard - PostOptima AI | Track Your Social Media
          Performance
        </title>
        <meta
          name="description"
          content="Comprehensive analytics dashboard showing your social media post performance trends, engagement predictions, and algorithm compatibility scores across all platforms."
        />
        <meta
          name="keywords"
          content="social media analytics, post performance tracking, engagement analytics, algorithm score tracking, content performance dashboard"
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background - Using motion values for smooth performance */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.3),transparent)]" />
          <motion.div
            className="absolute inset-0"
            style={{ background: backgroundGradient }}
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Track your post performance trends and optimize your content
              strategy
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <StatCard
                icon={Activity}
                title="Total Analyses"
                value={data.length}
                subtitle="Posts analyzed"
                color="blue"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatCard
                icon={TrendingUp}
                title="Avg Engagement"
                value={`${avgEngagement}%`}
                subtitle="Predicted engagement rate"
                color="green"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <StatCard
                icon={Target}
                title="Avg Algorithm Score"
                value={avgScore}
                subtitle="Out of 100"
                color="purple"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StatCard
                icon={Sparkles}
                title="Best Performance"
                value={
                  bestPerforming
                    ? `${bestPerforming.engagement_prediction}%`
                    : "N/A"
                }
                subtitle={
                  bestPerforming
                    ? `on ${bestPerforming.platform}`
                    : "No data yet"
                }
                color="yellow"
              />
            </motion.div>
          </motion.div>

          {/* Chart Section */}
          <motion.div
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur opacity-15 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Performance Trends
                </h2>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formatted}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="engagementGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="scoreGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#06b6d4"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      fontSize={12}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                      }}
                      cursor={false}
                      animationDuration={100}
                      wrapperStyle={{ outline: "none" }}
                      allowEscapeViewBox={{ x: false, y: false }}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#engagementGradient)"
                      name="Engagement %"
                      isAnimationActive={false}
                      dot={false}
                      activeDot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#scoreGradient)"
                      name="Algorithm Score"
                      isAnimationActive={false}
                      dot={false}
                      activeDot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl blur opacity-15 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Recent Analyses
                </h3>
              </div>

              {data.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="text-6xl mb-4 opacity-50">📊</div>
                  <p className="text-gray-400 text-lg mb-2">No analyses yet</p>
                  <p className="text-gray-500">
                    Start analyzing your content to see performance insights
                    here
                  </p>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {data.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors duration-200 group transform-gpu will-change-transform"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + idx * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${getPlatformColor(
                            item.platform
                          )} text-white text-lg font-bold min-w-[60px] text-center`}
                        >
                          {getPlatformIcon(item.platform)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-semibold capitalize text-lg">
                              {item.platform}
                            </span>
                            <div className="flex gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.algorithm_score >= 70
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : item.algorithm_score >= 40
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                              >
                                Score: {item.algorithm_score}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.engagement_prediction >= 50
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                    : item.engagement_prediction >= 25
                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                }`}
                              >
                                Engagement: {item.engagement_prediction}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-gray-300 text-sm truncate">
                              <strong>Original:</strong> {item.original_content}
                            </p>
                            {item.optimized_content && (
                              <p className="text-gray-400 text-sm truncate">
                                <strong>Optimized:</strong>{" "}
                                {item.optimized_content}
                              </p>
                            )}
                            <p className="text-gray-500 text-xs">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements - Reduced from 6 to 3 for better performance */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
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
                duration: 12 + i * 3, // Slower, smoother animations
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2,
              }}
              style={{
                left: `${20 + i * 25}%`,
                top: `${15 + (i % 2) * 40}%`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
