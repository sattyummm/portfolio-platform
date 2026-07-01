"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Camera, Film, ArrowUpRight, Mail, FileText, Loader2, Database, Phone, Star
} from "lucide-react";

interface LiveProject {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
}

interface UserProfile {
  name: string;
  titles: string;
  phone: string;
  instagram: string;
  profilePicUrl: string;
}

interface InboxMessage {
  rating: number;
}

const staticCreativeCards = [
  { id: "photography", title: "Photography", desc: "Visual storytelling capturing street aesthetics and uncompressed frames.", icon: Camera, color: "from-amber-500 to-orange-500", href: "/creative/photography" },
  { id: "videography", title: "Videography & Editing", desc: "Cinematic short films, multi-ratio narrative direction, video editing layouts, and high-energy Reels.", icon: Film, color: "from-purple-500 to-pink-500", href: "/creative/videography" }
];

export default function HomePage() {
  const [identityMode, setIdentityMode] = useState<"tech" | "creative">("tech");
  const [dbProjects, setDbProjects] = useState<LiveProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "Satyam Kumar", 
    titles: "Software Engineer • Creator • Musician", 
    phone: "", 
    instagram: "", 
    profilePicUrl: ""
  });

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    async function hydratePayloads() {
      try {
        const projRes = await fetch("/api/projects");
        const projData = await projRes.json();
        if (projData.success) setDbProjects(projData.data || []);

        const profRes = await fetch("/api/profile");
        const profData = await profRes.json();
        if (profData.success && profData.data) {
          setProfile(profData.data);
        }

        const msgRes = await fetch("/api/messages");
        const msgData = await msgRes.json();
        if (msgData.success && msgData.data && msgData.data.length > 0) {
          const total = msgData.data.reduce((acc: number, cur: InboxMessage) => acc + cur.rating, 0);
          const avg = total / msgData.data.length;
          setAvgRating(Number(avg.toFixed(1)));
        }
      } catch (err) {
        console.error("Failed to read server framework clusters:", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    hydratePayloads();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMessage(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: senderName, email: senderEmail, message: senderMessage, rating: selectedRating }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Message dispatched securely!");
        setSenderName(""); setSenderEmail(""); setSenderMessage(""); setSelectedRating(5);
        
        // Refresh average score instantly
        const msgRes = await fetch("/api/messages");
        const msgData = await msgRes.json();
        if (msgData.success && msgData.data && msgData.data.length > 0) {
          const total = msgData.data.reduce((acc: number, cur: InboxMessage) => acc + cur.rating, 0);
          setAvgRating(Number((total / msgData.data.length).toFixed(1)));
        }
      }
    } catch {
      alert("Communication routing channel fault.");
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-[#f4f4f5] pb-40 font-sans overflow-x-hidden selection:bg-neutral-800">
      
      <div className="absolute top-[100px] left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />

      {/* --- HERO PROFILE MATRIX HEADER --- */}
      <section className="mx-auto max-w-6xl px-6 pt-24 text-center md:pt-32">
        
        {profile.profilePicUrl ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mb-6 h-28 w-28 rounded-full border-2 border-white/10 p-1 bg-black/60 backdrop-blur-md shadow-2xl overflow-hidden aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.profilePicUrl} alt={profile.name} className="h-full w-full object-cover rounded-full" />
          </motion.div>
        ) : (
          <div className="mx-auto mb-6 h-28 w-28 rounded-full border border-dashed border-white/10 bg-neutral-900/40 backdrop-blur-sm" />
        )}

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/80 px-3 py-1 text-xs text-neutral-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available for Engineering & Creative Roles
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
          {profile.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mx-auto mt-4 max-w-2xl text-base text-neutral-400 sm:text-lg font-light tracking-wide">
          {profile.titles}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mx-auto mt-10 flex w-fit gap-1 rounded-full border border-white/5 bg-neutral-900/60 backdrop-blur-md p-1">
          {(["tech", "creative"] as const).map((mode) => (
            <button 
              key={mode} 
              onClick={() => setIdentityMode(mode)} 
              className={`relative rounded-full px-6 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${identityMode === mode ? "text-black" : "text-neutral-400 hover:text-white"}`}
            >
              {identityMode === mode && (
                <motion.div layoutId="activeTab" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative z-10">{mode === "tech" ? "Technology" : "Creativity"}</span>
            </button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="#work" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 font-medium text-black hover:bg-neutral-200 transition-colors">View My Work</a>
          <a href="resume.pdf" download="resume.pdf" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-neutral-900/50 px-5 font-medium text-white hover:bg-neutral-200 transition-colors">
            <FileText size={16} /> Download Resume
          </a>
        </motion.div>
      </section>

      {/* --- WORK SHOWCASE MATRIX --- */}
      <section id="work" className="mx-auto mt-24 max-w-6xl px-6">
        
        {/* Technology Tab Content View Layout */}
        {identityMode === "tech" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-8 pb-3 border-b border-white/5">
              <Database size={14} className="text-blue-500" /> Live Engineering Deployments
            </div>
            {loadingProjects ? (
              <div className="flex items-center gap-2 text-xs text-neutral-500 py-4"><Loader2 size={14} className="animate-spin" /> Querying cluster...</div>
            ) : dbProjects.length === 0 ? (
              <div className="text-xs text-neutral-500 py-4 bg-neutral-900/10 rounded-xl p-6 border border-white/5">No active software repositories currently published.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dbProjects.map((project) => (
                  <a href={project.githubUrl || "#"} target={project.githubUrl ? "_blank" : "_self"} key={project._id} className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-gradient-to-b from-neutral-900/40 to-neutral-950 p-6 shadow-xl hover:border-white/10 hover:bg-neutral-900/60 transition-all">
                    <div>
                      <div className="w-fit rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 text-white shadow-lg"><Code2 size={20} /></div>
                      <h3 className="mt-5 text-lg font-medium text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                      <p className="mt-2 text-sm text-neutral-400 line-clamp-3 leading-relaxed font-light">{project.description}</p>
                      {project.techStack && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.techStack.map((tech, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5 font-mono">{tech}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex items-center gap-1 text-xs font-medium text-neutral-500 group-hover:text-white transition-colors">
                      {project.githubUrl ? "Launch Repository" : "View Details"} <ArrowUpRight size={14} />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Creativity Tab Content View Layout */}
        {identityMode === "creative" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between border-b border-white/5 mb-8 pb-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400">
                <Camera size={14} className="text-purple-500" /> Multimedia Arts Portfolio
              </div>
              
              {avgRating !== null && (
                <div className="inline-flex items-center gap-1.5 bg-neutral-900/60 border border-white/5 rounded-full px-3 py-1 text-xs font-mono text-neutral-300 backdrop-blur-sm">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span>Platform Evaluation: <span className="text-white font-bold">{avgRating}</span>/5</span>
                </div>
              )}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto mb-20">
              <AnimatePresence mode="popLayout">
                {staticCreativeCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <a href={card.href} key={card.id} className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-neutral-900/20 p-6 transition-all hover:border-white/10 hover:bg-neutral-900/60 shadow-xl">
                      <div>
                        <div className={`w-fit rounded-lg bg-gradient-to-br ${card.color} p-2.5 text-white shadow-lg`}><Icon size={20} /></div>
                        <h3 className="mt-5 text-lg font-medium text-white group-hover:text-purple-400 transition-colors">{card.title}</h3>
                        <p className="mt-2 text-sm text-neutral-400 line-clamp-2 leading-relaxed font-light">{card.desc}</p>
                      </div>
                      <div className="mt-6 flex items-center gap-1 text-xs font-medium text-neutral-500 group-hover:text-white transition-colors">Explore Space <ArrowUpRight size={14} /></div>
                    </a>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* --- 📥 RECRUITER FORM (ENCAPSULATED INSIDE CREATIVE PANEL ONLY) --- */}
            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl border-t border-white/5 pt-12">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-white flex items-center justify-center gap-2">
                  <Mail size={18} className="text-blue-500" /> Secure Transmission Node
                </h2>
                <p className="mt-1 text-xs text-neutral-500">Leave a project rating evaluation or dispatch communication parameters here.</p>
              </div>
              <form onSubmit={handleSendMessage} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6 backdrop-blur-sm shadow-2xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Your Name</label>
                    <input type="text" required value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="e.g., Alex Carter" className="mt-2 h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Callback Email</label>
                    <input type="email" required value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="alex@company.com" className="mt-2 h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700" />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest block mb-2">Platform Rating Evaluation</label>
                  <div className="flex gap-1.5 items-center bg-black h-10 px-4 rounded-lg border border-white/5 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setSelectedRating(star)} className="text-sm outline-none transition-transform active:scale-95">
                        <span className={star <= selectedRating ? "text-amber-400" : "text-neutral-700"}>★</span>
                      </button>
                    ))}
                    <span className="text-[11px] font-mono text-neutral-500 ml-2">({selectedRating}/5 Stars)</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Transmission Payload</label>
                  <textarea required rows={4} value={senderMessage} onChange={(e) => setSenderMessage(e.target.value)} placeholder="Outline project parameters..." className="mt-2 w-full rounded-lg border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-white/20 transition-colors resize-none placeholder:text-neutral-700" />
                </div>
                <button type="submit" disabled={sendingMessage} className="h-10 w-full rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                  {sendingMessage ? "Broadcasting..." : "Dispatch Message"}
                </button>
              </form>
            </motion.section>
          </motion.div>
        )}
      </section>

      {/* --- GLOBAL FOOTER BLOCK --- */}
      <footer className="absolute bottom-6 left-0 right-0 mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between px-6 text-xs text-neutral-600 max-w-6xl">
        <p>© 2026 Platform. Built with Next.js.</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
          {profile.phone && (
            <span className="text-neutral-400 font-mono inline-flex items-center gap-1.5 bg-neutral-900/40 border border-white/5 px-2.5 py-0.5 rounded-md">
              <Phone size={11} className="text-blue-500" /> {profile.phone}
            </span>
          )}
          {profile.instagram && (
            <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:text-white text-pink-400 transition-colors font-mono">
              Instagram
            </a>
          )}
          <a href="https://github.com/sattyummm" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/satyam-kumar-dtu" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="mailto:satyamkumarwork007@gmail.com" className="hover:text-white transition-colors flex items-center gap-1"><Mail size={14} /> Contact</a>
        </div>
      </footer>

    </div>
  );
}