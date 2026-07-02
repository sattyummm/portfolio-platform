"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Camera, Film, ArrowUpRight, Mail, FileText, Loader2, Database, Phone, Star, Award, X, Sparkles, GraduationCap, Briefcase
} from "lucide-react";

interface LiveProject { _id: string; title: string; description: string; techStack: string[]; githubUrl?: string; }
interface CreativeAsset { _id: string; title: string; description: string; category: string; mediaUrl: string; }
interface CertificateAsset { _id: string; name: string; issuer: string; description?: string; credentialUrl?: string; image?: string; }
interface UserProfile { name: string; titles: string; phone: string; instagram: string; profilePicUrl: string; }

interface DynamicSkill { _id: string; category: string; items: string[]; }
interface DynamicEdu { _id: string; degree: string; institution: string; duration: string; score: string; subtitle?: string; }
interface DynamicExp { _id: string; role: string; company: string; duration: string; bullets: string[]; }

export default function HomePage() {
  const [identityMode, setIdentityMode] = useState<"tech" | "creative">("tech");
  const [dbProjects, setDbProjects] = useState<LiveProject[]>([]);
  const [dbCertificates, setDbCertificates] = useState<CertificateAsset[]>([]);
  const [dbCreative, setDbCreative] = useState<CreativeAsset[]>([]);
  
  const [dbSkills, setDbSkills] = useState<DynamicSkill[]>([]);
  const [dbEducations, setDbEducations] = useState<DynamicEdu[]>([]);
  const [dbExperiences, setDbExperiences] = useState<DynamicExp[]>([]);
  
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  
  // Interactive Lightbox Modals states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<LiveProject | null>(null);
  
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
        if (projRes.ok) setDbProjects((await projRes.json()).data || []);
        const certRes = await fetch("/api/certificates");
        if (certRes.ok) setDbCertificates((await certRes.json()).data || []);
        const creativeRes = await fetch("/api/creative");
        if (creativeRes.ok) setDbCreative((await creativeRes.json()).data || []);

        const skillsRes = await fetch("/api/skills");
        if (skillsRes.ok) setDbSkills((await skillsRes.json()).data || []);
        const eduRes = await fetch("/api/education");
        if (eduRes.ok) setDbEducations((await eduRes.json()).data || []);
        const expRes = await fetch("/api/experience");
        if (expRes.ok) setDbExperiences((await expRes.json()).data || []);

        const profRes = await fetch("/api/profile");
        const profData = await profRes.json();
        if (profData.success && profData.data) setProfile(profData.data);

        const msgRes = await fetch("/api/messages");
        const msgData = await msgRes.json();
        if (msgData.success && msgData.data && msgData.data.length > 0) {
          const total = msgData.data.reduce((acc: number, cur: any) => acc + cur.rating, 0);
          setAvgRating(Number((total / msgData.data.length).toFixed(1)));
        }
      } catch (err) {
        console.error("Failed to read server database clusters:", err);
      } finally {
        setLoadingAssets(false);
      }
    }
    void hydratePayloads();
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
      if ((await res.json()).success) {
        alert("Message dispatched securely!");
        setSenderName(""); setSenderEmail(""); setSenderMessage(""); setSelectedRating(5);
      }
    } catch {
      alert("Communication routing channel fault.");
    } finally {
      setSendingMessage(false);
    }
  };

  const photosArray = dbCreative.filter(a => a.category === "PHOTOGRAPHY");
  const videosArray = dbCreative.filter(a => a.category === "VIDEOGRAPHY");

  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-[#f4f4f5] pb-40 font-sans overflow-x-hidden selection:bg-neutral-800">
      
      <div className="absolute top-[100px] left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />

      {/* HERO HEADER */}
      <section className="mx-auto max-w-6xl px-6 pt-24 text-center md:pt-32">
        {profile.profilePicUrl ? (
          <img src={profile.profilePicUrl} alt={profile.name} className="mx-auto mb-6 h-28 w-28 rounded-full border-2 border-white/10 p-1 bg-black/60 backdrop-blur-md shadow-2xl overflow-hidden aspect-square object-cover" />
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
            <button key={mode} onClick={() => setIdentityMode(mode)} className={`relative rounded-full px-6 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${identityMode === mode ? "text-black" : "text-neutral-400 hover:text-white"}`}>
              {identityMode === mode && (
                <motion.div layoutId="activeTab" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative z-10">{mode === "tech" ? "Technology" : "Creativity"}</span>
            </button>
          ))}
        </motion.div>
      </section>

      {/* SHOWCASE PANEL WORK TRACK */}
      <section id="work" className="mx-auto mt-24 max-w-5xl px-6">
        
        {/* ==================================================================== */}
        {/* 💻 PANEL A: TECHNOLOGY HUB */}
        {identityMode === "tech" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-20">
            
            {/* TECHNICAL SKILLS SUBSECTION */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2 pb-2 border-b border-white/5">
                <Sparkles size={14} className="text-cyan-400" /> Expertise
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Technical Skills</h2>
              <p className="text-xs text-neutral-500 mt-1 mb-8 font-light">A curated stack spanning machine learning, data structures, and full-stack development.</p>
              
              {loadingAssets ? (
                <div className="text-xs text-neutral-500 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Gathering skill cards...</div>
              ) : dbSkills.length === 0 ? (
                <div className="text-xs text-neutral-500 py-6 border border-dashed border-white/5 rounded-xl text-center bg-neutral-950/40">No technical skills loaded in this block section.</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {dbSkills.map((skill) => (
                    <div key={skill._id} className="p-5 rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-sm shadow-xl space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 border-b border-white/5 pb-2">{skill.category}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.items.map((item, i) => (
                          <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-900 border border-white/5 text-neutral-400 font-mono">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EDUCATION HIGHLIGHTS SUBSECTION */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2 pb-2 border-b border-white/5">
                <GraduationCap size={14} className="text-blue-400" /> Background
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Education</h2>
              
              {loadingAssets ? (
                <div className="text-xs text-neutral-500 flex items-center gap-2 pt-4"><Loader2 size={12} className="animate-spin" /> Extracting educational history...</div>
              ) : dbEducations.length === 0 ? (
                <div className="text-xs text-neutral-500 py-6 border border-dashed border-white/5 rounded-xl text-center bg-neutral-950/40 mt-6">No background education logged.</div>
              ) : (
                <div className="mt-8 space-y-4">
                  {dbEducations.map((edu) => (
                    <div key={edu._id} className="p-5 rounded-xl border border-white/5 bg-neutral-950/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-white/10">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white">{edu.degree}</h3>
                        <p className="text-xs text-neutral-400 font-light">{edu.institution}</p>
                        {edu.subtitle && <p className="text-[10px] text-cyan-400 font-mono pt-0.5">{edu.subtitle}</p>}
                      </div>
                      <div className="sm:text-right flex-shrink-0">
                        <span className="text-sm font-bold text-white block sm:inline-block tracking-tight bg-neutral-900 border border-white/5 px-2.5 py-1 rounded-md">{edu.score}</span>
                        <span className="text-[10px] font-mono text-neutral-500 block mt-1">{edu.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EXPERIENCE LOGS SUBSECTION */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2 pb-2 border-b border-white/5">
                <Briefcase size={14} className="text-purple-400" /> Work
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Experience</h2>
              
              {loadingAssets ? (
                <div className="text-xs text-neutral-500 flex items-center gap-2 pt-4"><Loader2 size={12} className="animate-spin" /> Processing professional logs...</div>
              ) : dbExperiences.length === 0 ? (
                <div className="text-xs text-neutral-500 py-6 border border-dashed border-white/5 rounded-xl text-center bg-neutral-950/40 mt-6">No previous corporate experience logged.</div>
              ) : (
                <div className="mt-8 space-y-4">
                  {dbExperiences.map((exp) => (
                    <div key={exp._id} className="p-6 rounded-xl border border-white/5 bg-neutral-900/10 backdrop-blur-sm shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4">
                        <div>
                          <h3 className="text-base font-semibold text-white">{exp.role}</h3>
                          <p className="text-xs text-purple-400 font-mono mt-0.5">{exp.company}</p>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">{exp.duration}</span>
                      </div>
                      <ul className="space-y-2.5">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="text-xs text-neutral-400 font-light leading-relaxed flex items-start gap-2.5">
                            <span className="text-purple-500 mt-1 select-none">→</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LICENSES & CERTIFICATIONS */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6 pb-3 border-b border-white/5">
                <Award size={14} className="text-emerald-400" /> Licenses & Certifications
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {dbCertificates.map((cert) => (
                  <div key={cert._id} onClick={() => cert.image && setSelectedImage(cert.image)} className={`flex gap-4 p-4 rounded-xl border border-white/5 bg-neutral-950/40 shadow-xl items-start transition-all hover:border-white/10 ${cert.image ? "cursor-pointer" : ""}`}>
                    {cert.image ? (
                      <img src={cert.image} alt={cert.issuer} className="w-12 h-12 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-900 border border-white/5 rounded-lg flex items-center justify-center text-neutral-600 flex-shrink-0"><Award size={20} /></div>
                    )}
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-white truncate leading-snug">{cert.name}</h4>
                      <p className="text-xs text-neutral-400 leading-none">{cert.issuer}</p>
                      {cert.description && <p className="text-[11px] text-neutral-500 font-light mt-1 line-clamp-2 leading-relaxed">{cert.description}</p>}
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors mt-2 font-mono">Show credential <ArrowUpRight size={12} /></a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROJECTS SUBSECTION */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6 pb-3 border-b border-white/5">
                <Database size={14} className="text-blue-500" /> Projects
              </div>
              
              {loadingAssets ? (
                <div className="flex items-center gap-2 text-xs text-neutral-500 py-4"><Loader2 size={14} className="animate-spin" /> Querying projects...</div>
              ) : dbProjects.length === 0 ? (
                <div className="text-xs text-neutral-500 py-4 bg-neutral-900/10 rounded-xl p-6 border border-white/5">No active projects currently published.</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dbProjects.map((project) => (
                    <div 
                      key={project._id}
                      onClick={() => setSelectedProject(project)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-gradient-to-b from-neutral-900/40 to-neutral-950 p-6 shadow-xl hover:border-white/10 hover:bg-neutral-900/60 transition-all cursor-pointer"
                    >
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
                        View Details <ArrowUpRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* 🎬 PANEL B: CREATIVITY HUB VIEW */}
        {identityMode === "creative" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-20">
            
            {/* TRUE MASONRY PHOTOGRAPHY SHOWCASE SUBSECTION */}
            <div>
              <div className="flex items-center justify-between border-b border-white/5 mb-6 pb-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400"><Camera size={14} className="text-amber-500" /> Photography Showcase</div>
                {avgRating !== null && (
                  <div className="inline-flex items-center gap-1.5 bg-neutral-900/60 border border-white/5 rounded-full px-3 py-1 text-xs font-mono text-neutral-300">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span>Evaluation: <span className="text-white font-bold">{avgRating}</span>/5</span>
                  </div>
                )}
              </div>
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance] w-full mx-auto space-y-4">
                {photosArray.map((photo) => (
                  <div key={photo._id} onClick={() => setSelectedImage(photo.mediaUrl)} className="break-inside-avoid relative overflow-hidden rounded-xl border border-white/5 bg-neutral-950 cursor-pointer shadow-md hover:border-white/10 transition-all group w-full mb-4 block">
                    <img src={photo.mediaUrl} alt="Seamless Fluid exposure Capture" className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-[9px] font-mono bg-black/70 border border-white/10 px-2.5 py-1.5 rounded-full text-white uppercase tracking-widest">Expand Frame</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* VIDEOGRAPHY EMBED CORES SUBSECTION */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6 pb-3 border-b border-white/5"><Film size={14} className="text-purple-500" /> Videography & Production Layouts</div>
              <div className="grid gap-6 sm:grid-cols-2">
                {videosArray.map((video) => (
                  <div key={video._id} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-5 shadow-2xl">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/5 bg-black">
                      <iframe src={video.mediaUrl} title={video.title} allowFullScreen className="absolute inset-0 h-full w-full border-0" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{video.title}</h3>
                      <p className="mt-1 text-xs text-neutral-400 font-light leading-relaxed">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REVIEW & FEEDBACK LOOP FORM */}
            <section className="mx-auto max-w-xl border-t border-white/5 pt-12">
              <div className="text-center mb-6 space-y-1">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-center gap-2">
                  <Mail size={14} className="text-blue-500" /> Leave a Review & Feedback
                </h2>
                <p className="text-xs text-neutral-500 font-light">
                  Submit a platform evaluation rating or dispatch your message variables securely.
                </p>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6 backdrop-blur-sm shadow-2xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" required value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your Name" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none" />
                  <input type="email" required value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="Callback Email" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none" />
                </div>
                <div className="flex gap-1.5 items-center bg-black h-10 px-4 rounded-lg border border-white/5 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setSelectedRating(star)} className="text-sm outline-none"><span className={star <= selectedRating ? "text-amber-400" : "text-neutral-700"}>★</span></button>
                  ))}
                </div>
                <textarea required rows={4} value={senderMessage} onChange={(e) => setSenderMessage(e.target.value)} placeholder="Transmission Payload Details..." className="mt-2 w-full rounded-lg border border-white/5 bg-black p-4 text-sm text-white outline-none resize-none" />
                <button type="submit" disabled={sendingMessage} className="h-10 w-full rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black">{sendingMessage ? "Broadcasting..." : "Dispatch Message"}</button>
              </form>
            </section>
          </motion.div>
        )}
      </section>

      {/* LIGHTBOX POPUPS AND OVERLAYS WRAPPER AREA */}
      <AnimatePresence>
        {/* IMAGE LIGHTBOX MODAL */}
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out">
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-neutral-400 hover:text-white p-2"><X size={20} /></button>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(e) => e.stopPropagation()} className="relative max-w-5xl max-h-[85vh] rounded-xl border border-white/5 overflow-hidden">
              <img src={selectedImage} alt="Lightbox Fullscreen View" className="w-auto h-auto max-w-full max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}

        {/* DETAILED PROJECTS OVERLAY LIGHTBOX */}
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out">
            <motion.div initial={{ scale: 0.97, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 15 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-xl rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl cursor-default space-y-5 text-left">
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors p-1.5"><X size={16} /></button>
              <div className="space-y-2">
                <div className="w-fit rounded-lg bg-blue-600/10 border border-blue-500/20 p-2.5 text-blue-400"><Code2 size={20} /></div>
                <h3 className="text-xl font-bold text-white tracking-tight pt-2">{selectedProject.title}</h3>
              </div>
              <p className="text-xs text-neutral-400 font-light leading-relaxed whitespace-pre-wrap">{selectedProject.description}</p>
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">Architecture Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techStack.map((tech, i) => <span key={i} className="text-[10px] px-2.5 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-300 font-mono">{tech}</span>)}
                </div>
              </div>
              {selectedProject.githubUrl && (
                <div className="pt-2 border-t border-white/5">
                  <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition-colors">Launch Source Code Repository <ArrowUpRight size={14}/></a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL FOOTER */}
      <footer className="absolute bottom-6 left-0 right-0 mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between px-6 text-xs text-neutral-600 max-w-6xl">
        <p>© 2026 Platform. Built with Next.js.</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
          {profile.phone && <span className="text-neutral-400 font-mono inline-flex items-center gap-1.5 bg-neutral-900/40 border border-white/5 px-2.5 py-0.5 rounded-md"><Phone size={11} className="text-blue-500" /> {profile.phone}</span>}
          {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:text-white text-pink-400 transition-colors font-mono">Instagram</a>}
          <a href="https://github.com/sattyummm" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/satyam-kumar-dtu" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="mailto:satyamkumarwork007@gmail.com" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}