import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuthGuard } from "../lib/authGuard";
import { supabase } from "../lib/supabaseClient";
import AdBanner from "@/components/AdBanner";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [history, setHistory] = useState([]);

  const [profile, setProfile] = useState(null);

  const { user, loading: authLoading } = useAuthGuard();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
    };

    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setHistory(data);
    };

    if (user) fetchHistory();
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ platform, postContent }) => {
    const session = await supabase.auth.getSession();
    const token = session.data?.session?.access_token;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform, postContent }),
      });

      const result = await res.json();

      if (result.error) {
        setErrorMsg(result.error);
        return;
      }

      localStorage.setItem(
        "latestAnalysis",
        JSON.stringify({
          original: postContent,
          ...result,
        })
      );
      router.push("/results");
    } catch (err) {
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/signup";
  };

  const startCheckout = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data?.session?.access_token;

    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        email: user.email,
      }),
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  if (authLoading) return <p className="text-center text-white">Loading...</p>;
  if (!profile) return <p>Loading profile...</p>;
  return (
    <main className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <motion.div
        className="max-w-xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          {user && (
            <p className="text-sm">
              Logged in as <strong>{user.email}</strong>
            </p>
          )}
          {!profile.is_subscribed ? (
            <button
              onClick={startCheckout}
              className="bg-yellow-500 px-4 py-2 rounded"
            >
              Upgrade to Pro
            </button>
          ) : (
            <p className="text-green-500">✅ You are a Pro user</p>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded text-white text-sm"
          >
            Log out
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-6">Content Analyzer</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Select Platform</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              {...register("platform", { required: true })}
            >
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Post Content</label>
            <textarea
              className="w-full h-40 p-3 rounded bg-gray-800 border border-gray-700"
              maxLength={500}
              placeholder="Paste your post content here..."
              {...register("postContent", {
                required: "Post content is required",
                maxLength: { value: 500, message: "Max 500 characters" },
              })}
            />
            {errors.postContent && (
              <p className="text-red-400 mt-1 text-sm">
                {errors.postContent.message}
              </p>
            )}
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Content"}
          </button>
        </form>

        <h3 className="text-xl font-bold mt-8 mb-2">Past Analyses</h3>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-4 border border-gray-700 rounded">
              <p className="text-sm text-gray-400">{item.created_at}</p>
              <p>
                <strong>Platform:</strong> {item.platform}
              </p>
              <p>
                <strong>Original:</strong> {item.original_content}
              </p>
              <p>
                <strong>Optimized:</strong> {item.optimized_content}
              </p>
              <p>
                <strong>Score:</strong> {item.algorithm_score} |{" "}
                <strong>Engagement:</strong> {item.engagement_prediction}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>
      {profile?.plan === "free" && (
        <div className="my-6">
          <AdBanner className="my-6 w-full max-w-md mx-auto" />
        </div>
      )}
    </main>
  );
}
