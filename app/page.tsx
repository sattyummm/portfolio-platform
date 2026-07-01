"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Camera, Film, Video, Layers, Music, 
  ArrowUpRight, Mail, FileText, Loader2, Database
} from "lucide-react";

// Structural Type Blueprint matching your Mongoose Cluster Schema
interface LiveProject {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
}

const staticCreativeCards = [
  { id: "photography", title: "Photography", desc: "Visual storytelling capturing street aesthetics and portrait realities.", icon: Camera, color: "from-amber-500 to-orange-500", href: "/creative/photography" },
  { id: "videography", title: "Videography & Reels", desc: "Cinematic direction, script pacing, and visual production layout.", icon: Film, color: "from-purple-500 to-pink-500", href: "/creative/videography" },
  { id: "editing", title: "Video Editing", desc: "Pacing dynamic breakdowns, motion graphics, and pristine audio layers.", icon: Video, color: "from-red-500 to-rose-500", href: "/creative/editing" },
  { id: "design", title: "Graphic Design", desc: "Minimalist brand architectures, visual pacing, and event design posters.", icon: Layers, color: "from-emerald-500 to-teal-500", href: "/creative/design" },
  { id: "music", title: "Music & Production", desc: "Acoustic vocals, studio drumming patterns, and rhythm structures.", icon: Music, color: "from-indigo-500 to-blue-500", href: "/creative/music" },
];

export default function HomePage() {
  const [identityMode, setIdentityMode] = useState<"all" | "tech" | "creative">("all");
  
  // Real-time Database State Controllers
  const [dbProjects, setDbProjects] = useState<LiveProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // 📝 Recruiter Transmission Form States
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Hydrate Data from Cluster Endpoint on Init
  useEffect(() => {
    async function fetchLiveProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) {
          setDbProjects(data.data || []);
        }
      } catch (err) {
        console.error("Failed to read database pipeline payload:", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchLiveProjects();
  }, []);

  // 🚀 Inbound Message API Dispatcher
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingMessage(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          message: senderMessage,
          rating: selectedRating
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Message dispatched securely. Rating log stored inside cluster!");
        setSenderName("");
        setSenderEmail("");
        setSenderMessage("");
        setSelectedRating(5);
      } else {
        alert(data.error || "Failed to commit message data.");
      }
    } catch {
      alert("Communication routing channel fault.");
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-[#f4f4f5] pb-40 font-sans overflow-x-hidden selection:bg-neutral-800">
      
      {/* Background Lighting Gradients */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[150px]" />

      {/* --- HERO SECTION --- */}
      <section className="mx-auto max-w-6xl px-6 pt-32 text-center md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-3 py-1 text-xs text-neutral-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available for Engineering & Creative Roles
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent"
        >
          Satyam Kumar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400 sm:text-xl font-light"
        >
          Software Engineer <span className="text-neutral-700">•</span> Creator <span className="text-neutral-700">•</span> Musician
        </motion.p>

        {/* Unified Brand Selector Switch */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-10 flex w-fit gap-1 rounded-full border border-white/5 bg-neutral-900/60 backdrop-blur-md p-1"
        >
          {(["all", "tech", "creative"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setIdentityMode(mode)}
              className={`relative rounded-full px-5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                identityMode === mode ? "text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              {identityMode === mode && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{mode === "all" ? "Unified Brand" : mode === "tech" ? "Technology" : "Creativity"}</span>
            </button>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a href="#work" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 font-medium text-black hover:bg-neutral-200 transition-colors">
            View My Work
          </a>
          <a href="resume.pdf" download="resume.pdf" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-neutral-900/50 px-5 font-medium text-white hover:bg-neutral-955 transition-colors">
            <FileText size={16} /> Download Resume
          </a>
        </motion.div>
      </section>

      {/* --- WORK SHOWCASE MATRIX --- */}
      <section id="work" className="mx-auto mt-32 max-w-6xl px-6">
        <div className="flex flex-col justify-between border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Selected Ventures</h2>
            <p className="mt-1 text-sm text-neutral-500">A high-fidelity layout of my engineering builds and creative works.</p>
          </div>
        </div>

        {/* Dynamic Software Engineering Grid Section */}
        {(identityMode === "all" || identityMode === "tech") && (
          <div className="mt-12">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
              <Database size={14} className="text-blue-500" /> Live Engineering Deployments
            </div>
            
            {loadingProjects ? (
              <div className="flex items-center gap-2 text-xs text-neutral-500 py-4">
                <Loader2 size={14} className="animate-spin" /> Querying cluster architecture...
              </div>
            ) : dbProjects.length === 0 ? (
              <div className="text-xs text-neutral-500 py-4 bg-neutral-900/10 rounded-xl p-6 border border-white/5">
                No active software repositories currently published to the core console index.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dbProjects.map((project) => (
                  <motion.a
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    href={project.githubUrl || "#"}
                    target={project.githubUrl ? "_blank" : "_self"}
                    key={project._id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-gradient-to-b from-neutral-900/40 to-neutral-950 p-6 transition-all hover:border-white/10 hover:bg-neutral-900/60 shadow-xl"
                  >
                    <div>
                      <div className="w-fit rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 text-white shadow-lg shadow-blue-500/10">
                        <Code2 size={20} />
                      </div>
                      <h3 className="mt-5 text-lg font-medium text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                      <p className="mt-2 text-sm text-neutral-400 line-clamp-3 leading-relaxed font-light">{project.description}</p>
                      
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.techStack.map((tech, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5 font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex items-center gap-1 text-xs font-medium text-neutral-500 group-hover:text-white transition-colors">
                      {project.githubUrl ? "Launch Repository" : "View Details"}{" "}
                      <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Creative Section Grid */}
        {(identityMode === "all" || identityMode === "creative") && (
          <div className="mt-16">
            {(identityMode === "all") && (
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6 border-t border-white/5 pt-12">
                <Camera size={14} className="text-purple-500" /> Multimedia Arts Portfolio
              </div>
            )}
            
            <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {staticCreativeCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <motion.a
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      href={card.href}
                      key={card.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-neutral-900/20 p-6 transition-all hover:border-white/10 hover:bg-neutral-900/60"
                    >
                      <div>
                        <div className={`w-fit rounded-lg bg-gradient-to-br ${card.color} p-2.5 text-white shadow-lg`}>
                          <Icon size={20} />
                        </div>
                        <h3 className="mt-5 text-lg font-medium text-white">{card.title}</h3>
                        <p className="mt-2 text-sm text-neutral-400 line-clamp-2 leading-relaxed font-light">{card.desc}</p>
                      </div>
                      
                      <div className="mt-6 flex items-center gap-1 text-xs font-medium text-neutral-500 group-hover:text-white transition-colors">
                        Explore Space <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </motion.a>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </section>

      {/* --- 📥 RECRUITER TRANSMISSION NODE & RATING FORM --- */}
      <section className="mx-auto mt-24 max-w-xl px-6 border-t border-white/5 pt-16">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center justify-center gap-2">
            <Mail size={18} className="text-blue-500" /> Secure Transmission Node
          </h2>
          <p className="mt-1 text-xs text-neutral-500">Leave a project rating evaluation or dispatch communication parameters here.</p>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6 backdrop-blur-sm shadow-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Your Name</label>
              <input 
                type="text" required value={senderName} onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g., Alex Carter" 
                className="mt-2 h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Callback Email</label>
              <input 
                type="email" required value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="alex@company.com" 
                className="mt-2 h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors placeholder:text-neutral-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest block mb-2">Platform Rating Evaluation</label>
            <div className="flex gap-1.5 items-center bg-black h-10 px-4 rounded-lg border border-white/5 w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="text-sm outline-none transition-transform active:scale-95 text-neutral-700"
                >
                  <span className={star <= selectedRating ? "text-amber-400" : "text-neutral-700"}>★</span>
                </button>
              ))}
              <span className="text-[11px] font-mono text-neutral-500 ml-2">({selectedRating}/5 Stars)</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Transmission Payload</label>
            <textarea 
              required rows={4} value={senderMessage} onChange={(e) => setSenderMessage(e.target.value)}
              placeholder="Outline project parameters or roles engineering overview..." 
              className="mt-2 w-full rounded-lg border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-white/20 transition-colors resize-none placeholder:text-neutral-700"
            />
          </div>

          <button 
            type="submit" disabled={sendingMessage}
            className="h-10 w-full rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 transition-colors flex items-center justify-center gap-2"
          >
            {sendingMessage ? "Broadcasting..." : "Dispatch Message"}
          </button>
        </form>
      </section>

      {/* --- FOOTER SOCIAL LINKS --- */}
      <footer className="absolute bottom-6 left-0 right-0 mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-neutral-600">
        <p>© 2026 Platform. Built with Next.js.</p>
        <div className="flex gap-6 items-center">
          <a href="https://github.com/sattyummm" target="_blank" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/satyam-kumar-dtu" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="mailto:satyamkumarwork007@gmail.com" className="hover:text-white transition-colors flex items-center gap-1"><Mail size={14} /> Contact</a>
        </div>
      </footer>

    </div>
  );
}