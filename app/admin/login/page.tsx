"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Access verification credentials rejected.");
      }
    } catch {
      setError("Network infrastructure pipeline communication fault.");
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black text-[#f4f4f5] font-sans px-4 relative selection:bg-neutral-800">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-neutral-900/40 p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-xl border border-white/10 bg-neutral-900 p-3 text-white shadow-lg shadow-blue-500/5">
            <Lock size={22} className="text-neutral-300" />
          </div>
          <h2 className="mt-5 text-sm font-semibold uppercase tracking-widest text-white">Console Authorization Required</h2>
          <p className="mt-1.5 text-xs text-neutral-500">Provide administrative master key string to execute pipeline access.</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Master Pass Key</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••" 
              className="mt-2.5 h-11 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors tracking-widest text-center"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-950/20 p-3 text-xs text-red-400">
              <ShieldAlert size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={authenticating}
            className="h-11 w-full mt-4 rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 transition-colors flex items-center justify-center gap-2"
          >
            {authenticating ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Verifying Vault...
              </>
            ) : (
              "Grant Authentication"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}