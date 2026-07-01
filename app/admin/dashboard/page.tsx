"use client";

import { useEffect, useState } from "react";
import { PlusCircle, MessageSquare, ShieldCheck, Loader2, User, Phone, Globe } from "lucide-react";

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

  // 🎨 Portfolio Upload States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("PHOTOGRAPHY");
  const [mediaUrl, setMediaUrl] = useState("");
  const [publishing, setPublishing] = useState(false);

  // 👤 Profile Form Customizer States
  const [pName, setPName] = useState("");
  const [pTitles, setPTitles] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pInstagram, setPInstagram] = useState("");
  const [pProfilePicUrl, setPProfilePicUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function initDashboard() {
      try {
        const msgRes = await fetch("/api/messages");
        const msgJson = await msgRes.json();
        if (msgJson.success) setMessages(msgJson.data || []);

        const profRes = await fetch("/api/profile");
        const profJson = await profRes.json();
        if (profJson.success && profJson.data) {
          setPName(profJson.data.name || "Satyam Kumar");
          setPTitles(profJson.data.titles || "Software Engineer • Creator • Musician");
          setPPhone(profJson.data.phone || "");
          setPInstagram(profJson.data.instagram || "");
          setPProfilePicUrl(profJson.data.profilePicUrl || "");
        }
      } catch (error) {
        console.error("Dashboard initialization error:", error);
      } finally {
        setLoading(false);
      }
    }
    initDashboard();
  }, []);

  // ⚡ COMPRESSOR: Converts disk images to safe, lightweight string tokens
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 300; // Small crisp thumbnail resolution profile
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setPProfilePicUrl(compressedBase64);
      };
    };
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pName,
          titles: pTitles,
          phone: pPhone,
          instagram: pInstagram,
          profilePicUrl: pProfilePicUrl
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Identity parameters updated successfully!");
      } else {
        alert(json.error || "Failed updating baseline properties.");
      }
    } catch (err) {
      alert("Network or pipeline processing failure.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePublishAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    try {
      const res = await fetch("/api/creative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, mediaUrl }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Creative work successfully broadcasted!");
        setTitle(""); setDescription(""); setMediaUrl("");
      }
    } catch (err) {
      alert("Failed rendering content upload stream.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 p-8 font-sans selection:bg-neutral-800">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10 border-b border-white/5 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="text-blue-500" size={24} /> Central Operations Console
            </h1>
            <p className="text-xs text-neutral-500 mt-1">Configure global identity metrics and manage work portfolios.</p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* 👤 PROFILE CUSTOMIZER ROW */}
          <div className="lg:col-span-4 border border-white/5 bg-neutral-900/10 rounded-xl p-5 backdrop-blur-sm shadow-2xl space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 flex items-center gap-2 mb-2">
              <User size={16} className="text-blue-400" /> Core Bio Customizer
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Full Name</label>
                <input type="text" value={pName} onChange={(e) => setPName(e.target.value)} className="h-9 w-full rounded-lg border border-white/5 bg-black px-3 text-xs text-white outline-none focus:border-blue-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Sub-Header Titles</label>
                <input type="text" value={pTitles} onChange={(e) => setPTitles(e.target.value)} className="h-9 w-full rounded-lg border border-white/5 bg-black px-3 text-xs text-white outline-none focus:border-blue-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><Phone size={10} /> Contact Number</label>
                <input type="text" placeholder="+91 99999 99999" value={pPhone} onChange={(e) => setPPhone(e.target.value)} className="h-9 w-full rounded-lg border border-white/5 bg-black px-3 text-xs text-white outline-none focus:border-blue-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><Globe size={10} /> Instagram Handle Link</label>
                <input type="text" placeholder="https://instagram.com/username" value={pInstagram} onChange={(e) => setPInstagram(e.target.value)} className="h-9 w-full rounded-lg border border-white/5 bg-black px-3 text-xs text-white outline-none focus:border-blue-500/40" />
              </div>
              
              <div className="border-t border-white/5 pt-3">
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Avatar Profile Picture (Local Drive)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 file:cursor-pointer" />
                {pProfilePicUrl && (
                  <div className="mt-3 flex items-center gap-3 bg-neutral-900/40 p-2 rounded-lg border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pProfilePicUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <span className="text-[9px] font-mono text-neutral-500">Local Image Cached</span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={savingProfile} className="h-9 w-full rounded-lg bg-blue-500 text-xs font-semibold uppercase tracking-wider text-white hover:bg-blue-600 transition-colors mt-2">
                {savingProfile ? "Saving Parameters..." : "Sync Identity Profile"}
              </button>
            </form>
          </div>

          {/* 🎨 MEDIA BROADCASTER MODULE */}
          <div className="lg:col-span-4 border border-white/5 bg-neutral-900/10 rounded-xl p-5 backdrop-blur-sm">
            <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-5 flex items-center gap-2">
              <PlusCircle size={16} className="text-purple-400" /> Broadcast Creative Asset
            </h2>
            <form onSubmit={handlePublishAsset} className="space-y-4">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Asset Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 w-full rounded-lg border border-white/5 bg-black px-3 text-xs text-white outline-none focus:border-purple-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Target Space</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-9 w-full rounded-lg border border-white/5 bg-black px-3 text-xs text-white outline-none cursor-pointer">
                  <option value="PHOTOGRAPHY">PHOTOGRAPHY</option>
                  <option value="VIDEOGRAPHY">VIDEOGRAPHY & EDITING</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Media Link</label>
                <input type="text" required value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="h-9 w-full rounded-lg border border-white/5 bg-black px-3 text-xs text-white outline-none focus:border-purple-500/40" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Description Context</label>
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-white/5 bg-black p-3 text-xs text-white outline-none focus:border-purple-500/40 resize-none" />
              </div>
              <button type="submit" disabled={publishing} className="h-9 w-full rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors">
                Publish Asset Package
              </button>
            </form>
          </div>

          {/* 📨 INBOX STREAM BLOCK */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" /> Inbound Feed ({messages.length})
            </h2>
            <div className="grid gap-3 max-h-[520px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div key={msg._id} className="border border-white/5 bg-neutral-900/30 rounded-xl p-4 text-xs">
                  <div className="flex justify-between font-medium text-white mb-1">
                    <span>{msg.name}</span>
                    <span className="text-amber-400">★ {msg.rating}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] font-light">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}