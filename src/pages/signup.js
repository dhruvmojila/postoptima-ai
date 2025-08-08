import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function SignUp() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(
        "Check your email to verify your account. After that, log in."
      );
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setErrorMsg("Google login failed: " + error.message);
  };

  if (authLoading || user) return null;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Sign Up</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 rounded "
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-green-400 text-sm">{successMsg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 py-2 rounded text-white"
          >
            {loading ? "Signing Up..." : "Sign Up with Email"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 py-2 rounded text-white"
        >
          Continue with Google
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already verified?{" "}
          <Link href="/login" className="underline text-blue-400">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
