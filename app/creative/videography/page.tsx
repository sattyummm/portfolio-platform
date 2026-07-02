"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Film, Loader2 } from "lucide-react";
import Link from "next/link";

interface CreativeAsset {
  _id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
}

export default function VideographyPage() {
  const [videos, setVideos] = useState<CreativeAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/creative");
        const json = await res.json();
        if (json.success) {
          // ⚡ FILTER: Keep only items assigned to the videography and editing space
          const filtered = (json.data || []).filter(
            (asset: CreativeAsset) => asset.category === "VIDEOGRAPHY"
          );
          setVideos(filtered);
        }
      } catch (err) {
        console.error("Failed loading pipeline stream:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors mb-2">
              <ArrowLeft size={12} /> Back to Hub
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Film size={22} className="text-purple-500" /> Videography & Editing
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center gap-2 text-xs text-neutral-500 justify-center py-20">
            <Loader2 size={16} className="animate-spin" /> Mapping render frames...
          </div>
        ) : videos.length === 0 ? (
          <div className="text-xs text-neutral-500 text-center py-20 border border-dashed border-white/5 rounded-xl">
            No video sequences currently broadcasted to this node.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {videos.map((video) => (
              <div key={video._id} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-5 shadow-2xl">
                
                {/* 🌟 IFRAME VIEWPORT ENGINE: Plays streaming platforms natively without broken canvas locks */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/5 bg-black">
                  <iframe
                    src={video.mediaUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">{video.title}</h3>
                  <p className="mt-1 text-xs text-neutral-400 font-light leading-relaxed">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}