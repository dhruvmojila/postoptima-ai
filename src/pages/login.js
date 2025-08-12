import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function Login() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExtensionLogin, setIsExtensionLogin] = useState(false);

  useEffect(() => {
    // Check if this login is from extension
    const urlParams = new URLSearchParams(window.location.search);
    const fromExtension = urlParams.get("extension") === "true";
    setIsExtensionLogin(fromExtension);

    if (!authLoading && user) {
      if (fromExtension) {
        // Send auth data to extension background script
        sendAuthToExtension(user);
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  // Enhanced function to send auth data to extension background script
  const sendAuthToExtension = async (user) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        // Send message to extension background script
        if (typeof window !== "undefined" && window.chrome?.runtime) {
          try {
            await chrome.runtime.sendMessage({
              type: "AUTH_SUCCESS",
              token: session.access_token,
              refreshToken: session.refresh_token,
              user: user,
            });

            // Show success message
            setErrorMsg("");
            alert(
              "Login successful! You can now close this tab and use the extension."
            );
          } catch (chromeError) {
            console.error("Failed to communicate with extension:", chromeError);
            setErrorMsg(
              "Login successful but failed to sync with extension. Please try logging in through the extension directly."
            );
          }
        } else {
          // Not in extension context, redirect to dashboard
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error sending auth to extension:", error);

      // Send error to extension
      if (typeof window !== "undefined" && window.chrome?.runtime) {
        try {
          chrome.runtime.sendMessage({
            type: "AUTH_ERROR",
            error: error.message,
          });
        } catch (e) {
          console.error("Failed to send error to extension:", e);
        }
      }

      setErrorMsg(
        "Login successful but failed to sync with extension. Please try logging in through the extension directly."
      );
    }
  };

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
      if (isExtensionLogin) {
        sendAuthToExtension(data.user);
      } else {
        router.push("/dashboard");
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const redirectTo = isExtensionLogin
      ? `${window.location.origin}/login?extension=true`
      : `${window.location.origin}/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
      },
    });

    if (error) {
      setErrorMsg("Google login failed: " + error.message);

      // Send error to extension if in extension context
      if (
        isExtensionLogin &&
        typeof window !== "undefined" &&
        window.chrome?.runtime
      ) {
        chrome.runtime
          .sendMessage({
            type: "AUTH_ERROR",
            error: error.message,
          })
          .catch(console.error);
      }
    }
  };

  // Listen for auth state changes to handle OAuth callback
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session && isExtensionLogin) {
          sendAuthToExtension(session.user);
        } else if (event === "SIGNED_OUT" && isExtensionLogin) {
          // Handle sign out
          if (typeof window !== "undefined" && window.chrome?.runtime) {
            chrome.runtime
              .sendMessage({
                type: "AUTH_LOGOUT",
              })
              .catch(console.error);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isExtensionLogin]);

  if (authLoading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );

  if (user && !isExtensionLogin) return null;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">
          {isExtensionLogin ? "Login for Extension" : "Login"}
        </h2>

        {isExtensionLogin && (
          <div className="bg-blue-900 p-3 rounded text-sm">
            <p>
              🔗 You&apos;re logging in through the browser extension. After
              successful login, you can close this tab and the extension will be
              authenticated.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 rounded text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 rounded text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMsg && (
            <div
              className={`text-sm p-2 rounded ${
                errorMsg.includes("successful")
                  ? "bg-green-900 text-green-200"
                  : "bg-red-900 text-red-200"
              }`}
            >
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 py-2 rounded text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-700"
        >
          Continue with Google
        </button>

        {!isExtensionLogin && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            New here?{" "}
            <Link href="/signup" className="underline text-blue-400">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
