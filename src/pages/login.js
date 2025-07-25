import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else if (!data.user.email_confirmed_at) {
      setErrorMsg("Please verify your email before logging in.");
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setErrorMsg("Google login failed: " + error.message);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 rounded "
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 py-2 rounded text-white"
          >
            {loading ? "Logging In..." : "Log In"}
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
          New here?{" "}
          <Link href="/signup" className="underline text-blue-400">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
