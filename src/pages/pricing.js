import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    try {
      setLoading(true);
      setError("");
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;
      const user = session.data?.session?.user;
      if (!token || !user) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id, email: user.email }),
      });

      const { url, error: apiError } = await res.json();
      if (apiError || !url) {
        setError(apiError || "Unable to start checkout");
        return;
      }
      window.location.href = url;
    } catch (_) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Pricing</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Free</h3>
          <ul className="list-disc pl-4">
            <li>5 analyses/day</li>
            <li>Basic optimization</li>
            <li>Ads supported</li>
          </ul>
        </div>
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Premium – $9.99/month</h3>
          <ul className="list-disc pl-4">
            <li>Unlimited usage</li>
            <li>Advanced suggestions</li>
            <li>No ads</li>
          </ul>
          <button
            onClick={startCheckout}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 mt-4 rounded hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Redirecting..." : "Upgrade"}
          </button>
          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        </div>
      </div>
    </main>
  );
}
