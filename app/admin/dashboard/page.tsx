"use client";

import { useEffect, useState } from "react";
import { Mail, Star, Calendar, User, MessageSquare } from "lucide-react";

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

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages");
        const json = await res.json();
        if (json.success) {
          setMessages(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch messages node logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Central Operations Console</h1>
          <p className="text-xs text-neutral-500 mt-1">Review incoming recruiter correspondence pipelines and rating evaluations.</p>
        </header>

        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
            <Mail size={16} /> Inbound Recruiter Signals ({messages.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 border border-white/5 bg-neutral-900/20 rounded-xl text-xs text-neutral-500">
              Querying database indexes...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 border border-white/5 bg-neutral-900/20 rounded-xl text-xs text-neutral-500">
              No transmission logs currently recorded in this sector.
            </div>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className="border border-white/5 bg-neutral-900/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-white text-xs font-medium">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white flex items-center gap-2">
                          {msg.name}
                        </h3>
                        <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 hover:underline">
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Star Display Node */}
                      <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < msg.rating ? "fill-amber-400 text-amber-400" : "text-neutral-800"} 
                          />
                        ))}
                      </div>
                      
                      <div className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
                        <Calendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}