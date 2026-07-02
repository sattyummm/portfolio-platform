"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, Loader2, User, Phone, Globe, Award, Trash2, Edit3, FolderGit, PlusCircle, MessageSquare, Sparkles, GraduationCap, Briefcase, Image as ImageIcon, Link as LinkIcon
} from "lucide-react";

type ActivePanel = "profile" | "skills" | "education" | "experience" | "projects" | "certificates" | "creative" | "inbox";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActivePanel>("profile");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [creativeAssets, setCreativeAssets] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Form States - Profile
  const [pName, setPName] = useState("");
  const [pTitles, setPTitles] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pInstagram, setPInstagram] = useState("");
  const [pProfilePicUrl, setPProfilePicUrl] = useState("");

  // Form States - Skills
  const [skillCategory, setSkillCategory] = useState("");
  const [skillItemsRaw, setSkillItemsRaw] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // Form States - Education
  const [eduDegree, setEduDegree] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDuration, setEduDuration] = useState("");
  const [eduScore, setEduScore] = useState("");
  const [eduSubtitle, setEduSubtitle] = useState("");
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  // Form States - Experience
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expBulletsRaw, setExpBulletsRaw] = useState("");
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // Form States - Projects (RE-RESTORED MANAGEMENT CORE)
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjTitleDesc] = useState("");
  const [projStackRaw, setProjStackRaw] = useState("");
  const [projGitUrl, setProjGitUrl] = useState("");
  const [editingProjId, setEditingProjId] = useState<string | null>(null);

  // Form States - Creative Media Broadcaster
  const [category, setCategory] = useState("PHOTOGRAPHY");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); 
  const [editingCreativeId, setEditingCreativeId] = useState<string | null>(null);

  // Form States - Certifications
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDesc, setCertDesc] = useState("");
  const [certUrl, setCertUrl] = useState("");
  const [certImage, setCertImage] = useState("");
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const msg = await (await fetch("/api/messages")).json();
      if (msg.success) setMessages(msg.data || []);
      const proj = await (await fetch("/api/projects")).json();
      if (proj.success) setProjects(proj.data || []);
      const creative = await (await fetch("/api/creative")).json();
      if (creative.success) setCreativeAssets(creative.data || []);
      const certs = await (await fetch("/api/certificates")).json();
      if (certs.success) setCertificates(certs.data || []);
      const sk = await (await fetch("/api/skills")).json();
      if (sk.success) setSkills(sk.data || []);
      const ed = await (await fetch("/api/education")).json();
      if (ed.success) setEducations(ed.data || []);
      const ex = await (await fetch("/api/experience")).json();
      if (ex.success) setExperiences(ex.data || []);

      const prof = await (await fetch("/api/profile")).json();
      if (prof.success && prof.data) {
        setPName(prof.data.name || "Satyam Kumar");
        setPTitles(prof.data.titles || "Software Engineer • Creator • Musician");
        setPPhone(prof.data.phone || "");
        setPInstagram(prof.data.instagram || "");
        setPProfilePicUrl(prof.data.profilePicUrl || "");
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { void refreshData(); }, []);

  const handleCompressFile = (e: React.ChangeEvent<HTMLInputElement>, target: "avatar" | "certificate" | "photography") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let maxDimension = 1200;
        if (target === "avatar") maxDimension = 300;
        if (target === "photography") maxDimension = 2000;
        
        let width = img.width, height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) { height = Math.round((height * maxDimension) / width); width = maxDimension; }
          else { width = Math.round((width * maxDimension) / height); height = maxDimension; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(img, 0, 0, width, height); }
        
        const compressedBase64 = canvas.toDataURL("image/jpeg", target === "photography" ? 0.92 : 0.88);
        if (target === "avatar") setPProfilePicUrl(compressedBase64);
        else if (target === "certificate") setCertImage(compressedBase64);
        else if (target === "photography") setMediaUrl(compressedBase64);
      };
    };
  };

  const handleDelete = async (id: string, route: string) => {
    if (!confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      const res = await fetch(`/api/${route}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if ((await res.json()).success) { void refreshData(); }
    } catch { alert("Failed transaction routing connection."); }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsArr = skillItemsRaw.split(",").map(i => i.trim()).filter(i => i.length > 0);
    try {
      const res = await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingSkillId, category: skillCategory, items: itemsArr }) });
      if ((await res.json()).success) { alert("Skills collection block synchronized!"); setSkillCategory(""); setSkillItemsRaw(""); setEditingSkillId(null); void refreshData(); }
    } catch { alert("Error updating skills block matrix."); }
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/education", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingEduId, degree: eduDegree, institution: eduInstitution, duration: eduDuration, score: eduScore, subtitle: eduSubtitle }) });
      if ((await res.json()).success) { alert("Education matrix row updated!"); setEduDegree(""); setEduInstitution(""); setEduDuration(""); setEduScore(""); setEduSubtitle(""); setEditingEduId(null); void refreshData(); }
    } catch { alert("Error synchronizing education indices."); }
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    const bulletsArr = expBulletsRaw.split("\n").map(b => b.trim()).filter(b => b.length > 0);
    try {
      const res = await fetch("/api/experience", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingExpId, role: expRole, company: expCompany, duration: expDuration, bullets: bulletsArr }) });
      if ((await res.json()).success) { alert("Professional record securely deployed!"); setExpRole(""); setExpCompany(""); setExpDuration(""); setExpBulletsRaw(""); setEditingExpId(null); void refreshData(); }
    } catch { alert("Error formatting work records tracking payload."); }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const stackArr = projStackRaw.split(",").map(tech => tech.trim()).filter(tech => tech.length > 0);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingProjId, title: projTitle, description: projDesc, techStack: stackArr, githubUrl: projGitUrl })
      });
      if ((await res.json()).success) {
        alert("Project module array saved smoothly!");
        setProjTitle(""); setProjTitleDesc(""); setProjStackRaw(""); setProjGitUrl(""); setEditingProjId(null);
        void refreshData();
      }
    } catch { alert("Error indexing engineering records."); }
  };

  const handlePublishAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title: category === "PHOTOGRAPHY" ? "Photography Frame" : title, description: category === "PHOTOGRAPHY" ? "Gallery Exposure" : description, category, mediaUrl };
      const res = await fetch("/api/creative", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCreativeId ? { ...payload, id: editingCreativeId } : payload) });
      if ((await res.json()).success) { alert("Creative hub records updated!"); setTitle(""); setDescription(""); setMediaUrl(""); setEditingCreativeId(null); void refreshData(); }
    } catch { alert("Failure uploading portfolio asset."); }
  };

  const startEditCreative = (asset: any) => { setEditingCreativeId(asset._id); setCategory(asset.category); setTitle(asset.category === "PHOTOGRAPHY" ? "" : asset.title); setDescription(asset.category === "PHOTOGRAPHY" ? "" : asset.description); setMediaUrl(asset.mediaUrl); };
  const startEditCert = (cert: any) => { setEditingCertId(cert._id); setCertName(cert.name); setCertIssuer(cert.issuer); setCertDesc(cert.description || ""); setCertUrl(cert.credentialUrl || ""); setCertImage(cert.image || ""); };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-neutral-800 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-neutral-950 border-b md:border-b-0 md:border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between"><div className="flex items-center gap-2"><ShieldCheck className="text-blue-500" size={20} /><span className="text-sm font-semibold uppercase tracking-wider text-white">Console Central</span></div></div>
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "profile" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><User size={14} /> Edit Profile</button>
          <button onClick={() => setActiveTab("skills")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "skills" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><Sparkles size={14} /> Tech Skills</button>
          <button onClick={() => setActiveTab("education")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "education" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><GraduationCap size={14} /> Education Info</button>
          <button onClick={() => setActiveTab("experience")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "experience" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><Briefcase size={14} /> Work Experience</button>
          
          {/* RE-INJECTED DEDICATED SEPARATE PROJECTS BUTTON TARGET ROUTE */}
          <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "projects" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><FolderGit size={14} /> Projects</button>
          
          <button onClick={() => setActiveTab("certificates")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "certificates" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><Award size={14} /> Certifications</button>
          <button onClick={() => setActiveTab("creative")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "creative" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><PlusCircle size={14} /> Creative Hub</button>
          <button onClick={() => setActiveTab("inbox")} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider outline-none ${activeTab === "inbox" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}><MessageSquare size={14} /> Recruiter Inbox</button>
        </nav>
      </aside>

      {/* CORE DESKTOP VIEWPORT */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-xs text-neutral-500"><Loader2 size={24} className="animate-spin text-blue-500" /> Syncing network registries...</div>
        ) : (
          <div className="space-y-8">
            
            {/* PROFILE PANEL */}
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-xl">
                <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2"><User size={20} className="text-blue-500" /> Profile Customizer</h2>
                <form onSubmit={async (e) => { e.preventDefault(); const res = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: pName, titles: pTitles, phone: pPhone, instagram: pInstagram, profilePicUrl: pProfilePicUrl }) }); if ((await res.json()).success) alert("Profile Saved!"); }} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6">
                  <input type="text" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Full Name" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                  <input type="text" value={pTitles} onChange={(e) => setPTitles(e.target.value)} placeholder="Titles" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                  <input type="text" value={pPhone} onChange={(e) => setPPhone(e.target.value)} placeholder="Contact Number" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                  <input type="text" value={pInstagram} onChange={(e) => setPInstagram(e.target.value)} placeholder="Instagram URL" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                  <input type="file" accept="image/*" onChange={(e) => handleCompressFile(e, "avatar")} className="w-full text-xs text-neutral-500" />
                  <button type="submit" className="h-10 w-full rounded-lg bg-blue-600 text-xs font-semibold uppercase tracking-wider text-white">Sync Bio Details</button>
                </form>
              </div>
            )}

            {/* TECH SKILLS PANEL */}
            {activeTab === "skills" && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2"><Sparkles size={20} className="text-cyan-400" /> Technical Skills Workspace</h2>
                <div className="grid gap-6 md:grid-cols-12 items-start">
                  <form onSubmit={handleSaveSkill} className="md:col-span-5 space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6">
                    <input type="text" required value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} placeholder="Subsection Name" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <textarea required rows={4} value={skillItemsRaw} onChange={(e) => setSkillItemsRaw(e.target.value)} placeholder="Skills separated by commas" className="w-full rounded-lg border border-white/5 bg-black p-4 text-xs text-white outline-none resize-none" />
                    <button type="submit" className="h-10 w-full rounded-lg bg-cyan-600 text-xs font-semibold uppercase text-white">{editingSkillId ? "Modify Subsection" : "Add Skill Subsection"}</button>
                  </form>
                  <div className="md:col-span-7 space-y-3">
                    {skills.map((s: any) => (
                      <div key={s._id} className="p-4 rounded-xl border border-white/5 bg-neutral-950 flex justify-between items-center gap-4"><div className="min-w-0"><span className="text-xs font-bold text-white block">{s.category}</span><p className="text-[11px] text-neutral-400 mt-1 font-mono">{s.items.join(", ")}</p></div><div className="flex gap-1 flex-shrink-0"><button onClick={() => { setEditingSkillId(s._id); setSkillCategory(s.category); setSkillItemsRaw(s.items.join(", ")); }} className="p-1.5 text-neutral-500 hover:text-white"><Edit3 size={14}/></button><button onClick={() => handleDelete(s._id, "skills")} className="p-1.5 text-neutral-600 hover:text-red-400"><Trash2 size={14}/></button></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EDUCATION INFO PANEL */}
            {activeTab === "education" && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2"><GraduationCap size={20} className="text-blue-400" /> Education Background Workspace</h2>
                <div className="grid gap-6 md:grid-cols-12 items-start">
                  <form onSubmit={handleSaveEdu} className="md:col-span-5 space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6">
                    <input type="text" required value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="Degree / Class" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" required value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} placeholder="Institution Facility Name" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" required value={eduDuration} onChange={(e) => setEduDuration(e.target.value)} placeholder="Time Period" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" required value={eduScore} onChange={(e) => setEduScore(e.target.value)} placeholder="Scored Marks / CGPA" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" value={eduSubtitle} onChange={(e) => setEduSubtitle(e.target.value)} placeholder="Optional Sub-Context text line summary" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <button type="submit" className="h-10 w-full rounded-lg bg-blue-600 text-xs font-semibold uppercase text-white">{editingEduId ? "Update Data Row" : "Publish Degree Metric"}</button>
                  </form>
                  <div className="md:col-span-7 space-y-3">
                    {educations.map((e: any) => (
                      <div key={e._id} className="p-4 rounded-xl border border-white/5 bg-neutral-950 flex justify-between items-center gap-4"><div className="min-w-0"><span className="text-xs font-semibold text-white block truncate">{e.degree}</span><span className="text-[10px] text-neutral-500 font-mono">{e.institution} ({e.duration})</span></div><div className="flex gap-1 flex-shrink-0"><button onClick={() => { setEditingEduId(e._id); setEduDegree(e.degree); setEduInstitution(e.institution); setEduDuration(e.duration); setEduScore(e.score); setEduSubtitle(e.subtitle || ""); }} className="p-1.5 text-neutral-500 hover:text-white"><Edit3 size={14}/></button><button onClick={() => handleDelete(e._id, "education")} className="p-1.5 text-neutral-600 hover:text-red-400"><Trash2 size={14}/></button></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WORK EXPERIENCE PANEL */}
            {activeTab === "experience" && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2"><Briefcase size={20} className="text-purple-400" /> Professional Experience Workspace</h2>
                <div className="grid gap-6 md:grid-cols-12 items-start">
                  <form onSubmit={handleSaveExp} className="md:col-span-5 space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6">
                    <input type="text" required value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="Job Title" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" required value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Company Name" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" required value={expDuration} onChange={(e) => setExpDuration(e.target.value)} placeholder="Employment Timeframe" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <textarea required rows={5} value={expBulletsRaw} onChange={(e) => setExpBulletsRaw(e.target.value)} placeholder="Add details... Press ENTER for a new line detail" className="w-full rounded-lg border border-white/5 bg-black p-4 text-xs text-white outline-none resize-none" />
                    <button type="submit" className="h-10 w-full rounded-lg bg-purple-600 text-xs font-semibold uppercase text-white">{editingExpId ? "Save Modifications" : "Broadcast Corporate Record"}</button>
                  </form>
                  <div className="md:col-span-7 space-y-3">
                    {experiences.map((ex: any) => (
                      <div key={ex._id} className="p-4 rounded-xl border border-white/5 bg-neutral-950 flex justify-between items-center gap-4"><div className="min-w-0"><span className="text-xs font-semibold text-white block truncate">{ex.role}</span><span className="text-[10px] text-purple-400 font-mono">{ex.company} • {ex.duration}</span></div><div className="flex gap-1 flex-shrink-0"><button onClick={() => { setEditingExpId(ex._id); setExpRole(ex.role); setExpCompany(ex.company); setExpDuration(ex.duration); setExpBulletsRaw(ex.bullets.join("\n")); }} className="p-1.5 text-neutral-500 hover:text-white"><Edit3 size={14}/></button><button onClick={() => handleDelete(ex._id, "experience")} className="p-1.5 text-neutral-600 hover:text-red-400"><Trash2 size={14}/></button></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 🛠️ DEDICATED PROJECTS MANAGER WORKSPACE */}
            {activeTab === "projects" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2"><FolderGit size={20} className="text-blue-500" /> Projects</h2>
                  <p className="text-xs text-neutral-400 mt-1">Add, edit, or prune public software engineering deployment repositories.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-12 items-start">
                  <form onSubmit={handleSaveProject} className="md:col-span-5 space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6">
                    <input type="text" required value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Project Title (e.g., Code Runner)" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" value={projGitUrl} onChange={(e) => setProjGitUrl(e.target.value)} placeholder="Source Repository URL (Optional)" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <input type="text" required value={projStackRaw} onChange={(e) => setProjStackRaw(e.target.value)} placeholder="Tech Stack separated by commas (e.g., Next.js, Go)" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                    <textarea required rows={4} value={projDesc} onChange={(e) => setProjTitleDesc(e.target.value)} placeholder="Explain app capabilities..." className="w-full rounded-lg border border-white/5 bg-black p-4 text-xs text-white outline-none resize-none" />
                    <button type="submit" className="h-10 w-full rounded-lg bg-blue-600 text-xs font-semibold uppercase tracking-wider text-white">{editingProjId ? "Apply Code Fixes" : "Publish Project Specs"}</button>
                  </form>
                  <div className="md:col-span-7 space-y-3">
                    <h3 className="text-xs font-mono text-neutral-500">Live Architecture Repositories ({projects.length})</h3>
                    {projects.map((p: any) => (
                      <div key={p._id} className="p-4 rounded-xl border border-white/5 bg-neutral-950 flex justify-between items-center gap-4">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">{p.title}</span>
                          <span className="text-[10px] text-neutral-400 font-mono block truncate">{p.githubUrl || "No source branch url link logged"}</span>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => { setEditingProjId(p._id); setProjTitle(p.title); setProjGitUrl(p.githubUrl || ""); setProjStackRaw(p.techStack.join(", ")); setProjTitleDesc(p.description); }} className="p-1.5 text-neutral-500 hover:text-white"><Edit3 size={14}/></button>
                          <button onClick={() => handleDelete(p._id, "projects")} className="p-1.5 text-neutral-600 hover:text-red-400"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {activeTab === "certificates" && (
              <div className="space-y-4 max-w-xl">
                <form onSubmit={async (e) => { e.preventDefault(); const payload = { name: certName, issuer: certIssuer, description: certDesc, credentialUrl: certUrl, image: certImage }; const res = await fetch("/api/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCertId ? { ...payload, id: editingCertId } : payload) }); if ((await res.json()).success) { alert("License logged!"); setCertName(""); setCertIssuer(""); setCertDesc(""); setCertUrl(""); setCertImage(""); setEditingCertId(null); void refreshData(); } }} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6">
                  <input type="text" required value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="Course Name" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white" />
                  <input type="text" required value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Issuing Body" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white" />
                  <input type="text" value={certUrl} onChange={(e) => setCertUrl(e.target.value)} placeholder="Credential URL Verification" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white" />
                  <textarea rows={2} value={certDesc} onChange={(e) => setCertDesc(e.target.value)} placeholder="Optional summaries..." className="w-full rounded-lg border border-white/5 bg-black p-4 text-xs text-white outline-none resize-none" />
                  <input type="file" accept="image/*" onChange={(e) => handleCompressFile(e, "certificate")} className="w-full text-xs text-neutral-500" />
                  <button type="submit" className="h-10 w-full rounded-lg bg-emerald-600 text-xs font-semibold uppercase tracking-wider text-white">Broadcast Data</button>
                </form>
              </div>
            )}

            {/* CREATIVE HUB */}
            {activeTab === "creative" && (
              <div className="space-y-4 max-w-xl">
                <form onSubmit={async (e) => { e.preventDefault(); const payload = { title: category === "PHOTOGRAPHY" ? "Photography Frame" : title, description: category === "PHOTOGRAPHY" ? "Gallery Exposure" : description, category, mediaUrl }; const res = await fetch("/api/creative", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCreativeId ? { ...payload, id: editingCreativeId } : payload) }); if ((await res.json()).success) { alert("Creative hub records updated!"); setTitle(""); setDescription(""); setMediaUrl(""); setEditingCreativeId(null); void refreshData(); } }} className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/10 p-6">
                  <div><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white cursor-pointer outline-none"><option value="PHOTOGRAPHY">PHOTOGRAPHY GALLERY</option><option value="VIDEOGRAPHY">VIDEOGRAPHY & EDITING</option></select></div>
                  {category === "VIDEOGRAPHY" && (
                    <div className="space-y-4">
                      <input type="text" required={category === "VIDEOGRAPHY"} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video Title" className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                      <textarea required={category === "VIDEOGRAPHY"} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Video Description" className="w-full rounded-lg border border-white/5 bg-black p-4 text-xs text-white outline-none resize-none" />
                    </div>
                  )}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    {category === "PHOTOGRAPHY" && <input type="file" accept="image/*" onChange={(e) => handleCompressFile(e, "photography")} className="w-full text-xs text-neutral-500 file:bg-neutral-800 file:text-white" />}
                    <input type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder={category === "PHOTOGRAPHY" ? "Cloudinary URL Link" : "YouTube URL Link"} className="h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-xs text-white outline-none" />
                  </div>
                  <button type="submit" className="h-10 w-full rounded-lg bg-white text-xs font-semibold text-black uppercase tracking-wider">Publish Creative Asset</button>
                </form>
              </div>
            )}

            {/* MESSAGES SYSTEM */}
            {activeTab === "inbox" && (
              <div className="space-y-4 max-w-2xl">
                {messages.map((msg: any) => (
                  <div key={msg._id} className="border border-white/5 bg-neutral-950/40 p-4 rounded-xl text-xs flex justify-between items-start gap-4"><div><span className="text-white font-bold block">{msg.name} ({msg.email})</span><p className="text-neutral-400 mt-2 font-light">{msg.message}</p></div><span className="text-amber-400 font-mono">★ {msg.rating}</span></div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}