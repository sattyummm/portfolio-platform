"use client";

import { useEffect, useState } from "react";
import { Mail, Star, Calendar, PlusCircle, Sparkles } from "lucide-react";

interface InboxMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎨 Creative Work Upload States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("PHOTOGRAPHY");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages");
        const json = await res.json();
        if (json.success) setMessages(json.data);
      } catch (error) {
        console.error("Failed to fetch messages node logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  // ✨ AUTOMATIC MULTI-PLATFORM LINK PARSER (YouTube & Instagram Embeds)
  const formatMediaUrl = (rawUrl: string): string => {
    const url = rawUrl.trim();

    // 🎬 1. YOUTUBE MEDIA PIPELINE
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("v=")) {
        const match = url.match(/[?&]v=([^&#]+)/);
        videoId = match ? match[1] : "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
      } else if (url.includes("/shorts/")) {
        const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
        videoId = match ? match[1] : "";
      } else if (url.includes("/embed/")) {
        const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
        videoId = match ? match[1] : "";
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // 📸 2. INSTAGRAM PIPELINE (Posts & Reels)
    if (url.includes("instagram.com")) {
      // Pull the shortcode identifier regardless of trailing tracking strings
      const postMatch = url.match(/\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);
      if (postMatch && postMatch[2]) {
        return `https://www.instagram.com/p/${postMatch[2]}/embed/`;
      }
    }

    // Fallback: Direct CDN linkages (Cloudinary, Unsplash, etc.)
    return url;
  };

  const handleUploadWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    const finalMediaUrl = formatMediaUrl(mediaUrl);

    try {
      const res = await fetch("/api/creative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category, 
          mediaUrl: finalMediaUrl, 
          thumbnailUrl,
          isFeatured
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("Asset deployed securely into creative archive!");
        setTitle("");
        setDescription("");
        setMediaUrl("");
        setThumbnailUrl("");
        setIsFeatured(false);
      } else {
        alert(json.error || "Failed to broadcast creative entry data parameters.");
      }
    } catch (err) {
      alert("Pipeline server failure routing structural parameters.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Central Operations Console</h1>
          <p className="text-xs text-neutral-500 mt-1">Review recruiter communications and publish creative content streams dynamically.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 border border-white/5 bg-neutral-900/10 rounded-xl p-6 backdrop-blur-sm shadow-2xl">
            <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
              <PlusCircle size={16} className="text-purple-400" /> Broadcast Portfolio Asset
            </h2>

            <form onSubmit={handleUploadWork} className="space-y-4">
              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest block mb-2">Asset Title</label>
                <input 
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Cinematic Shutter / Reel Capture"
                  className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-purple-500/40 transition-colors placeholder:text-neutral-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest block mb-2">Target Content Space</label>
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-purple-500/40 transition-colors cursor-pointer"
                >
                  <option value="PHOTOGRAPHY">PHOTOGRAPHY (Cloudinary / IG Post Links)</option>
                  <option value="VIDEOGRAPHY">VIDEOGRAPHY & EDITING (YouTube / IG Reel Links)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest block mb-2">Media Content URL</label>
                <input 
                  type="text" required value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Cloudinary image, YouTube video, or Instagram post/reel link..."
                  className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-purple-500/40 transition-colors placeholder:text-neutral-700"
                />
                <span className="text-[10px] text-neutral-600 mt-1 block">YouTube and Instagram links will format to interactive embeds instantly.</span>
              </div>

              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest block mb-2">Description Summary (Required)</label>
                <textarea 
                  required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide artistic context, technical settings, or design frameworks..."
                  className="w-full rounded-lg border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-purple-500/40 transition-colors resize-none placeholder:text-neutral-700"
                />
              </div>

              <div className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-white/5">
                <input 
                  type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-black text-purple-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs text-neutral-400 cursor-pointer select-none flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-400" /> Feature inside prominent hero frames
                </label>
              </div>

              <button 
                type="submit" disabled={publishing}
                className="h-10 w-full rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 transition-colors"
              >
                {publishing ? "Broadcasting Package..." : "Publish Asset Package"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400">Inbound Recruiter Signals ({messages.length})</h2>
            {/* Messages rendering block stays intact below */}
            {loading ? (
              <div className="text-center py-12 border border-white/5 bg-neutral-900/20 rounded-xl text-xs text-neutral-500">Querying database indexes...</div>
            ) : (
              <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg._id} className="border border-white/5 bg-neutral-900/30 rounded-xl p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-white">{msg.name}</h3>
                        <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 hover:underline">{msg.email}</a>
                      </div>
                      <div className="text-xs text-neutral-500 font-mono">{new Date(msg.createdAt).toLocaleDateString()}</div>
                    </div>
                    <p className="text-xs text-neutral-300 whitespace-pre-wrap bg-black/20 p-3 rounded border border-white/5">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}