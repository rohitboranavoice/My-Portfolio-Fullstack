"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#FD853A]/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[#FD853A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1D2939]">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Enter credentials to access the CMS</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A] focus:ring-1 focus:ring-[#FD853A] transition-all"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-[#1D2939] text-white rounded-xl font-bold hover:bg-[#FD853A] transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
