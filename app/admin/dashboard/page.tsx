"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, Code2, Camera, Layers, MessageSquare, 
  Plus, Trash2, ExternalLink, X 
} from "lucide-react";

// Interface matching your Mongoose Schema
interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "creative" | "messages">("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dynamic Projects State Container
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Form Input States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);

  // 1. Fetch Projects from Database API Pipeline
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error("Fault reading active pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Add New Project Repository Handler
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Clean up tag array string commas
    const processedTags = tags.split(",").map(t => t.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          techStack: processedTags, 
          githubUrl: link 
        }),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        alert("Project compiled and stored in database successfully!");
        setIsModalOpen(false);
        
        // Reset states
        setTitle("");
        setDescription("");
        setTags("");
        setLink("");
        
        // Re-hydrate local array list view instantly
        fetchProjects();
      } else {
        alert(data.error || "Failed to commit data schema.");
      }
    } catch {
      alert("Network asset routing communication fault.");
    } finally {
      setSaving(false);
    }
  };

  // 3. Delete Project Repository Pipeline
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to purge this record?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Pipeline verification error executing delete sequence.");
      }
    } catch {
      alert("Network asset routing communication fault during deletion.");
    }
  };

  // Dynamic Metrics Matrix calculation
  const statCards = [
    { title: "Total Projects", count: projects.length.toString(), icon: Code2, accent: "text-blue-500" },
    { title: "Creative Media", count: "0", icon: Camera, accent: "text-purple-500" },
    { title: "Inbound Messages", count: "0", icon: MessageSquare, accent: "text-emerald-500" },
    { title: "Unique Visitors", count: "1,240", icon: BarChart3, accent: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-[#f4f4f5] font-sans selection:bg-neutral-800 relative">
      
      {/* Navigation Header */}
      <nav className="flex h-16 w-full items-center justify-between border-b border-white/5 bg-neutral-900/20 px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Satyam's Core Console</span>
        </div>
        <a href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
          View Live Site <ExternalLink size={12} />
        </a>
      </nav>

      <div className="mx-auto max-w-7xl px-8 py-10">
        
        {/* Statistics Metric Matrix */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="rounded-xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.title}</span>
                  <Icon size={16} className={stat.accent} />
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-white">{stat.count}</p>
              </div>
            );
          })}
        </div>

        {/* Section Toggles */}
        <div className="mt-12 flex gap-2 border-b border-white/5 pb-px">
          {([
            { id: "projects", label: "Software Projects", icon: Code2 },
            { id: "creative", label: "Creative Portfolio", icon: Layers },
            { id: "messages", label: "Inbox Forms", icon: MessageSquare }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "border-white text-white" 
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Workspace Management Panel Area */}
        <div className="mt-8 rounded-xl border border-white/5 bg-neutral-900/10 p-6 backdrop-blur-sm min-h-[300px]">
          {activeTab === "projects" && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-white">Project Repositories</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Manage live full-stack builds and GitHub links.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-xs font-semibold text-black hover:bg-neutral-200 transition-colors"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              <div className="mt-6 divide-y divide-white/5 border-t border-b border-white/5">
                {loading ? (
                  <div className="text-xs text-neutral-500 py-6">Syncing data assets...</div>
                ) : projects.length === 0 ? (
                  <div className="text-xs text-neutral-500 py-6">No repositories logged inside cluster. Click Add Project to seed data.</div>
                ) : (
                  projects.map((proj) => (
                    <div key={proj._id} className="flex items-center justify-between py-4">
                      <div>
                        <h4 className="text-sm font-medium text-white">{proj.title}</h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          {proj.techStack?.join(" • ") || "No Tech Specified"}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteProject(proj._id)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-red-950/30 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "creative" && (
            <div className="text-center py-12 text-xs text-neutral-600">
              No creative assets managed yet.
            </div>
          )}

          {activeTab === "messages" && (
            <div className="text-center py-12 text-xs text-neutral-600">
              Inbox clear. No new form submissions detected.
            </div>
          )}
        </div>
      </div>

      {/* --- FLOATING OVERLAY MODAL FORM CONFIGURATION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Register Project Repository</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Project Title</label>
                <input 
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Loop Short Film Site" 
                  className="mt-2 h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Tech Stack (comma separated)</label>
                <input 
                  type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind, MongoDB" 
                  className="mt-2 h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Live Deploy / GitHub Link</label>
                <input 
                  type="url" value={link} onChange={(e) => setLink(e.target.value)}
                  placeholder="https://github.com/..." 
                  className="mt-2 h-10 w-full rounded-lg border border-white/5 bg-black px-4 text-sm text-white outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Project Description</label>
                <textarea 
                  required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide scope overview details..." 
                  className="mt-2 w-full rounded-lg border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-white/20 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2 border-t border-white/5 pt-4 mt-6">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="h-10 flex-1 rounded-lg border border-white/10 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={saving}
                  className="h-10 flex-1 rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 transition-colors"
                >
                  {saving ? "Compiling..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}