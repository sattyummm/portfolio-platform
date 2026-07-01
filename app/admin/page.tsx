"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage("Access Granted. Initializing Secure Dashboard Workspace...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setStatusMessage(data.error || "Authentication verification failed.");
      }
    } catch (err) {
      setStatusMessage("Network boundary transmission error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-white/5 bg-neutral-900/40 p-8 backdrop-blur-xl"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Console Access</h1>
          <p className="mt-2 text-xs text-neutral-500">Authorized administrative verification terminal only.</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Ident Token ID</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@satyamkumar.com"
              className="mt-2 w-full h-10 rounded-lg border border-white/10 bg-black px-4 text-sm text-white placeholder-neutral-700 outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Security Access Cipher</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-2 w-full h-10 rounded-lg border border-white/10 bg-black px-4 text-sm text-white placeholder-neutral-700 outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-6 rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 transition-colors"
          >
            {loading ? "Verifying Keys..." : "Authenticate Core"}
          </button>
        </form>

        {statusMessage && (
          <p className="mt-6 text-center text-xs text-neutral-400 animate-pulse border-t border-white/5 pt-4">
            {statusMessage}
          </p>
        )}
      </motion.div>
    </div>
  );
}