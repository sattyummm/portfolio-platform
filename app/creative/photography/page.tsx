"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowLeft, Loader2, Calendar, Sparkles, X, Maximize2 } from "lucide-react";
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

export default function PhotographyGallery() {
  const [images, setImages] = useState<CreativeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<CreativeAsset | null>(null);

  useEffect(() => {
    async function loadPhotography() {
      try {
        const res = await fetch("/api/creative?category=PHOTOGRAPHY");
        const json = await res.json();
        if (json.success) setImages(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPhotography();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-[#f4f4f5] pb-24 font-sans selection:bg-neutral-800">
      <header className="border-b border-white/5 bg-neutral-950/20 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors group">
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" /> Back To Base
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400">
            <Camera size={14} className="text-purple-400" /> Photography Index
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 mt-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Visual Storytelling</h1>
          <p className="mt-2 text-sm text-neutral-500 max-w-xl leading-relaxed">
            Capturing street aesthetics, portrait realities, and light compositions via direct uploads and digital social layouts.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-500 gap-3">
            <Loader2 size={24} className="animate-spin text-purple-400" />
            <span className="text-xs font-mono tracking-wider">Streaming asset grid indexes...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24 border border-white/5 bg-neutral-900/10 rounded-xl text-xs text-neutral-500">
            No active photography entries found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, index) => {
              const isInstagram = img.mediaUrl.includes("instagram.com");

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={img._id}
                  onClick={() => !isInstagram && setFullscreenImage(img)}
                  className={`group relative overflow-hidden rounded-xl border border-white/5 bg-neutral-900/10 flex flex-col justify-between shadow-xl ${!isInstagram ? 'cursor-pointer' : ''}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                    {img.isFeatured && (
                      <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400 backdrop-blur-md">
                        <Sparkles size={10} className="fill-purple-400" /> Featured Still
                      </div>
                    )}

                    {isInstagram ? (
                      <iframe 
                        src={img.mediaUrl}
                        className="w-full h-full border-0 overflow-hidden"
                        scrolling="no"
                        allowTransparency
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                          <Maximize2 size={20} className="text-white scale-90 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.mediaUrl} alt={img.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" />
                      </>
                    )}
                  </div>

                  <div className="p-5 border-t border-white/5 bg-neutral-900/20">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium text-white truncate">{img.title}</h3>
                      <span className="text-[10px] text-neutral-600 font-mono shrink-0 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(img.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-400 leading-relaxed font-light line-clamp-2">{img.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* --- LIGHTBOX (Only works for non-Instagram direct pictures) --- */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullscreenImage(null)} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out">
            <button onClick={() => setFullscreenImage(null)} className="absolute top-6 right-6 p-3 rounded-full bg-neutral-900 border border-white/5 text-neutral-400"><X size={18} /></button>
            <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }} className="relative max-w-5xl max-h-[75vh]" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fullscreenImage.mediaUrl} alt={fullscreenImage.title} className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/5" />
            </motion.div>
            <div className="mt-6 text-center max-w-xl px-4"><h2 className="text-lg font-medium text-white">{fullscreenImage.title}</h2><p className="text-xs text-neutral-400 mt-2 font-light">{fullscreenImage.description}</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}