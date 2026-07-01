"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Film, ArrowLeft, Loader2, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

interface CreativeAsset {
  _id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
  createdAt: string;
  isFeatured?: boolean;
}

export default function VideographyGallery() {
  const [videos, setVideos] = useState<CreativeAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideography() {
      try {
        const res = await fetch("/api/creative?category=VIDEOGRAPHY");
        const json = await res.json();
        if (json.success) setVideos(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadVideography();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-[#f4f4f5] pb-24 font-sans selection:bg-neutral-800">
      <header className="border-b border-white/5 bg-neutral-950/20 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors group">
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" /> Back To Base
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400">
            <Film size={14} className="text-purple-400" /> Videography & Editing
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 mt-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Motion Pictures & Reels</h1>
          <p className="mt-2 text-sm text-neutral-500 max-w-xl leading-relaxed">
            A cohesive space presenting director logs, cinematic sequences, short films, and high-energy vertical Instagram Reels.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-500 gap-3">
            <Loader2 size={24} className="animate-spin text-purple-400" />
            <span className="text-xs font-mono tracking-wider">Streaming timeline layers...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-24 border border-white/5 bg-neutral-900/10 rounded-xl text-xs text-neutral-500">
            No active cinematic assets or editing reels published.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {videos.map((vid, index) => {
              const isInstagram = vid.mediaUrl.includes("instagram.com");

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={vid._id}
                  className="group relative border border-white/5 bg-neutral-900/10 rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl"
                >
                  {/* Dynamic aspect frame adjustment: Vertical block sizing profile for Reels vs Landscape 16:9 for YouTube */}
                  <div className={`relative w-full bg-neutral-950 ${isInstagram ? 'aspect-[4/5] sm:max-h-[580px]' : 'aspect-video'}`}>
                    {vid.isFeatured && (
                      <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400 backdrop-blur-md">
                        <Sparkles size={10} className="fill-purple-400" /> Featured Direct
                      </div>
                    )}
                    <iframe
                      src={vid.mediaUrl}
                      title={vid.title}
                      className="w-full h-full border-0 overflow-hidden"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      scrolling={isInstagram ? "no" : "yes"}
                    />
                  </div>

                  <div className="p-5 border-t border-white/5 bg-neutral-900/20">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium text-white truncate">{vid.title}</h3>
                      <span className="text-[10px] text-neutral-600 font-mono shrink-0 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(vid.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-400 leading-relaxed font-light line-clamp-3">{vid.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}