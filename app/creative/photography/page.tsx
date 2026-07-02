"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Loader2, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface CreativeAsset {
  _id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
}

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<CreativeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox view state loop
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/creative");
        const json = await res.json();
        if (json.success) {
          const filtered = (json.data || []).filter(
            (asset: CreativeAsset) => asset.category === "PHOTOGRAPHY"
          );
          setPhotos(filtered);
        }
      } catch (err) {
        console.error("Failed loading graphics stream:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans selection:bg-neutral-800">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors mb-2">
              <ArrowLeft size={12} /> Back to Hub
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Camera size={22} className="text-amber-500" /> Photography Showcase
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center gap-2 text-xs text-neutral-500 justify-center py-20">
            <Loader2 size={16} className="animate-spin" /> Fetching exposures...
          </div>
        ) : photos.length === 0 ? (
          <div className="text-xs text-neutral-500 text-center py-20 border border-dashed border-white/5 rounded-xl">
            No photography captures currently broadcasted to this node.
          </div>
        ) : (
          /* Clean, borderless visual asset masonry grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div 
                key={photo._id} 
                onClick={() => setSelectedPhotoUrl(photo.mediaUrl)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-950 border border-white/5 cursor-pointer shadow-xl transition-all hover:border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photo.mediaUrl} 
                  alt="Photography Portfolio Frame" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                
                {/* Subtle dark overlay lens on hover to signal interactivity */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[11px] font-mono tracking-wider bg-black/60 border border-white/10 px-3 py-1.5 rounded-full text-white backdrop-blur-sm">
                    Expand Frame
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 🌌 FULL-RESOLUTION LIGHTBOX POPUP MODAL */}
      <AnimatePresence>
        {selectedPhotoUrl && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoUrl(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedPhotoUrl(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors p-2 bg-neutral-900/80 border border-white/10 rounded-full outline-none"
            >
              <X size={20} />
            </button>
            <motion.div 
              initial={{ scale: 0.97, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-xl border border-white/5 shadow-2xl bg-black flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedPhotoUrl} 
                alt="Expanded Master Capture Preview" 
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}