"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  tab: "Project" | "Design";
  slug: string;
  title: string;
  imageKey: string;
  imageUrl: string;
  repositoryUrl: string;
  demoUrl: string;
}

interface Technology {
  id: string;
  name: string;
  imageKey: string;
  imageUrl: string;
  officialSite: string;
}

interface PortfolioData {
  hero: { greeting: string; headline: string; tagline: string };
  quote: { text: string; author: string };
  social: { linkedin: string; instagram: string; github: string; dribbble: string; email: string };
  projects: Project[];
  technologies: Technology[];
}

// ─── Blank templates ──────────────────────────────────────────────────────────
const blankProject = (): Project => ({
  id: `proj-${Date.now()}`,
  tab: "Project",
  slug: "",
  title: "",
  imageKey: "",
  imageUrl: "",
  repositoryUrl: "",
  demoUrl: "",
});

const blankTech = (): Technology => ({
  id: `tech-${Date.now()}`,
  name: "",
  imageKey: "",
  imageUrl: "",
  officialSite: "",
});

// ─── Small UI helpers ─────────────────────────────────────────────────────────
const TABS = ["Projects", "Technologies", "Hero", "Social & Quote", "Resume"] as const;
type TabName = typeof TABS[number];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
    />
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {label}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>("Projects");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeDragging, setResumeDragging] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [techIconFile, setTechIconFile] = useState<File | null>(null);
  const [techIconDragging, setTechIconDragging] = useState(false);
  const [techIconUploading, setTechIconUploading] = useState(false);
  const techIconInputRef = useRef<HTMLInputElement>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const ADMIN_PASSWORD = "rahul@admin123"; // change this!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      fetchData();
    } else {
      setLoginError("Wrong password. Try again.");
    }
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  async function fetchData() {
    const res = await fetch("/api/admin/data");
    const json = await res.json();
    setData(json);
  }

  async function saveData(updated: PortfolioData) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (res.ok) {
        showToast("Saved! Site is redeploying (~1 min) 🚀", "success");
        setData(updated);
      } else {
        showToast(`Error: ${json.error || "Unknown error"}`, "error");
        console.error("Save error detail:", json);
      }
    } catch (err: any) {
      showToast(`Network error: ${err?.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function uploadResume() {
    if (!resumeFile) return;
    setResumeUploading(true);
    try {
      const form = new FormData();
      form.append('resume', resumeFile);
      const res = await fetch('/api/admin/resume', { method: 'POST', body: form });
      const json = await res.json();
      if (res.ok) {
        showToast('Resume uploaded! Site is redeploying (~1 min) 🚀', 'success');
        setResumeFile(null);
      } else {
        showToast(`Error: ${json.error || 'Unknown error'}`, 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err?.message}`, 'error');
    } finally {
      setResumeUploading(false);
    }
  }

  async function uploadTechIcon() {
    if (!techIconFile || !editingTech) return;
    setTechIconUploading(true);
    try {
      const form = new FormData();
      form.append('icon', techIconFile);
      form.append('techId', editingTech.id);
      const res = await fetch('/api/admin/tech-icon', { method: 'POST', body: form });
      const json = await res.json();
      if (res.ok) {
        // Auto-save the tech with the new imageUrl so user doesn't need to click Save separately
        const updatedTech = { ...editingTech, imageUrl: json.url };
        setTechIconFile(null);
        saveTech(updatedTech);
        showToast('Icon uploaded and saved! Site redeploying (~1 min) 🎨', 'success');
      } else {
        showToast(`Error: ${json.error || 'Unknown error'}`, 'error');
      }
    } catch (err: any) {
      showToast(`Network error: ${err?.message}`, 'error');
    } finally {
      setTechIconUploading(false);
    }
  }

  // ── Project helpers ───────────────────────────────────────────────────────
  function saveProject(p: Project) {
    if (!data) return;
    const exists = data.projects.find((x) => x.id === p.id);
    const updated = exists
      ? data.projects.map((x) => (x.id === p.id ? p : x))
      : [...data.projects, p];
    const newData = { ...data, projects: updated };
    saveData(newData);
    setEditingProject(null);
  }

  function deleteProject(id: string) {
    if (!data) return;
    const newData = { ...data, projects: data.projects.filter((p) => p.id !== id) };
    saveData(newData);
    setDeleteConfirm(null);
  }

  // ── Tech helpers ──────────────────────────────────────────────────────────
  function saveTech(t: Technology) {
    if (!data) return;
    const exists = data.technologies.find((x) => x.id === t.id);
    const updated = exists
      ? data.technologies.map((x) => (x.id === t.id ? t : x))
      : [...data.technologies, t];
    const newData = { ...data, technologies: updated };
    saveData(newData);
    setEditingTech(null);
  }

  function deleteTech(id: string) {
    if (!data) return;
    const newData = { ...data, technologies: data.technologies.filter((t) => t.id !== id) };
    saveData(newData);
    setDeleteConfirm(null);
  }

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0d1120] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 text-2xl">
              🔐
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Rahul&apos;s Portfolio CMS</p>
          </div>
          <form
            onSubmit={handleLogin}
            className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-8 shadow-2xl"
          >
            <Label>Password</Label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              placeholder="Enter admin password"
              className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors mb-4"
              autoFocus
            />
            {loginError && (
              <p className="text-red-400 text-xs mb-4 bg-red-400/10 px-3 py-2 rounded-lg">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              className="w-full gradient-btn rounded-xl py-3 font-bold text-white text-sm tracking-wide"
            >
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0d1120] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Loading dashboard…
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d1120] text-white font-poppins">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[999] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold ${
              toast.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500 text-emerald-300"
                : "bg-red-500/20 border border-red-500 text-red-300"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-[#2e3a50] bg-[#0d1120]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-base">
              ✦
            </div>
            <div>
              <h1 className="font-bold text-base leading-none">Portfolio CMS</h1>
              <p className="text-xs text-slate-500 mt-0.5">Rahul Sharma</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <a
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 border border-[#2e3a50] px-3 py-1.5 rounded-lg"
            >
              View Site ↗
            </a>
            <button
              onClick={() => setLoggedIn(false)}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors border border-[#2e3a50] px-3 py-1.5 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-[#2e3a50] bg-[#0d1120]">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ═══ PROJECTS ════════════════════════════════════════════════════════ */}
        {activeTab === "Projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Projects & Designs</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {data.projects.filter((p) => p.tab === "Project").length} games ·{" "}
                  {data.projects.filter((p) => p.tab === "Design").length} designs
                </p>
              </div>
              <button
                onClick={() => setEditingProject(blankProject())}
                className="gradient-btn rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span> Add Project
              </button>
            </div>

            {/* Project cards */}
            <div className="grid gap-4">
              {["Project", "Design"].map((tabName) => (
                <div key={tabName}>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                    {tabName === "Project" ? "🎮 Games / Projects" : "🎨 UI Designs"}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.projects
                      .filter((p) => p.tab === tabName)
                      .map((p) => (
                        <motion.div
                          key={p.id}
                          layout
                          className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-5 hover:border-purple-500/40 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate">{p.title || "Untitled"}</h3>
                              <p className="text-slate-500 text-xs mt-1 truncate">/{p.slug}</p>
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {p.demoUrl && (
                                  <a
                                    href={p.demoUrl}
                                    target="_blank"
                                    className="text-xs text-blue-400 hover:underline"
                                  >
                                    Demo ↗
                                  </a>
                                )}
                                {p.repositoryUrl && (
                                  <a
                                    href={p.repositoryUrl}
                                    target="_blank"
                                    className="text-xs text-slate-400 hover:underline"
                                  >
                                    Repo ↗
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingProject({ ...p })}
                                className="p-2 rounded-xl bg-[#1e2535] hover:bg-purple-500/20 text-purple-400 transition-colors text-xs"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(p.id)}
                                className="p-2 rounded-xl bg-[#1e2535] hover:bg-red-500/20 text-red-400 transition-colors text-xs"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ TECHNOLOGIES ════════════════════════════════════════════════════ */}
        {activeTab === "Technologies" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Technology Stack</h2>
                <p className="text-slate-500 text-sm mt-1">{data.technologies.length} tools listed</p>
              </div>
              <button
                onClick={() => setEditingTech(blankTech())}
                className="gradient-btn rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span> Add Technology
              </button>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.technologies.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-5 hover:border-purple-500/40 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{t.name}</h3>
                      <p className="text-slate-500 text-xs mt-1 truncate max-w-[180px]">
                        imageKey: {t.imageKey}
                      </p>
                      {t.officialSite && (
                        <a
                          href={t.officialSite}
                          target="_blank"
                          className="text-xs text-blue-400 hover:underline mt-2 block"
                        >
                          Official site ↗
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingTech({ ...t })}
                        className="p-2 rounded-xl bg-[#1e2535] hover:bg-purple-500/20 text-purple-400 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(t.id)}
                        className="p-2 rounded-xl bg-[#1e2535] hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
        {activeTab === "Hero" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Hero Section</h2>
            <div className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-6 space-y-5">
              <div>
                <Label>Greeting line</Label>
                <Input
                  value={data.hero.greeting}
                  onChange={(v) => setData({ ...data, hero: { ...data.hero, greeting: v } })}
                  placeholder="Welcome to Rahul's Portfolio"
                />
              </div>
              <div>
                <Label>Headline (big title)</Label>
                <Input
                  value={data.hero.headline}
                  onChange={(v) => setData({ ...data, hero: { ...data.hero, headline: v } })}
                  placeholder="Designer of Dreams"
                />
              </div>
              <div>
                <Label>Tagline / Description</Label>
                <Textarea
                  value={data.hero.tagline}
                  onChange={(v) => setData({ ...data, hero: { ...data.hero, tagline: v } })}
                  placeholder="I'm Rahul Sharma…"
                  rows={4}
                />
              </div>
              <button
                onClick={() => saveData(data)}
                disabled={saving}
                className="gradient-btn rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

            <h2 className="text-xl font-bold mt-10 mb-6">Quote Section</h2>
            <div className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-6 space-y-5">
              <div>
                <Label>Quote text</Label>
                <Textarea
                  value={data.quote.text}
                  onChange={(v) => setData({ ...data, quote: { ...data.quote, text: v } })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Author name</Label>
                <Input
                  value={data.quote.author}
                  onChange={(v) => setData({ ...data, quote: { ...data.quote, author: v } })}
                />
              </div>
              <button
                onClick={() => saveData(data)}
                disabled={saving}
                className="gradient-btn rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ RESUME ══════════════════════════════════════════════════════════ */}
        {activeTab === "Resume" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <h2 className="text-xl font-bold mb-2">Resume / CV</h2>
            <p className="text-slate-500 text-sm mb-6">
              Upload a PDF to replace <code className="text-slate-300 bg-[#1e2535] px-1.5 py-0.5 rounded">/resume.pdf</code> on your site. The Navbar "Resume" button will serve this file directly.
            </p>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setResumeDragging(true); }}
              onDragLeave={() => setResumeDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setResumeDragging(false);
                const dropped = e.dataTransfer.files[0];
                if (dropped?.type === 'application/pdf') setResumeFile(dropped);
                else showToast('Please drop a PDF file', 'error');
              }}
              onClick={() => resumeInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
                resumeDragging
                  ? 'border-purple-500 bg-purple-500/10'
                  : resumeFile
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-[#2e3a50] bg-[#161d2f] hover:border-purple-500/60'
              }`}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setResumeFile(f);
                }}
              />
              <div className="text-4xl mb-3">{resumeFile ? '📄' : '📂'}</div>
              {resumeFile ? (
                <>
                  <p className="font-semibold text-emerald-400 text-sm">{resumeFile.name}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {(resumeFile.size / 1024).toFixed(1)} KB — click to change
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-300 text-sm">Drag & drop your PDF here</p>
                  <p className="text-slate-500 text-xs mt-1">or click to browse</p>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={uploadResume}
                disabled={!resumeFile || resumeUploading}
                className="gradient-btn rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-40"
              >
                {resumeUploading ? 'Uploading…' : 'Upload & Save Resume'}
              </button>
              {resumeFile && (
                <button
                  onClick={() => setResumeFile(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#2e3a50] text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-8 bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Current Resume</p>
              <a
                href="/resume.pdf"
                target="_blank"
                className="text-sm text-blue-400 hover:underline"
              >
                /resume.pdf ↗
              </a>
              <p className="text-slate-600 text-xs mt-1">Opens the currently deployed resume file</p>
            </div>
          </motion.div>
        )}

        {/* ═══ SOCIAL & QUOTE ══════════════════════════════════════════════════ */}
        {activeTab === "Social & Quote" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Social Media Links</h2>
            <div className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-6 space-y-5">
              {(
                [
                  { key: "linkedin", label: "LinkedIn URL", icon: "💼" },
                  { key: "instagram", label: "Instagram URL", icon: "📸" },
                  { key: "github", label: "GitHub URL", icon: "🐙" },
                  { key: "dribbble", label: "Dribbble URL", icon: "🏀" },
                  { key: "email", label: "Email (mailto:)", icon: "✉️" },
                ] as const
              ).map(({ key, label, icon }) => (
                <div key={key}>
                  <Label>
                    {icon} {label}
                  </Label>
                  <Input
                    value={data.social[key]}
                    onChange={(v) =>
                      setData({ ...data, social: { ...data.social, [key]: v } })
                    }
                    placeholder={`https://...`}
                  />
                </div>
              ))}
              <button
                onClick={() => saveData(data)}
                disabled={saving}
                className="gradient-btn rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ═══ PROJECT MODAL ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setEditingProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-7 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-bold mb-5">
                {data.projects.find((p) => p.id === editingProject.id)
                  ? "Edit Project"
                  : "New Project"}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <div className="flex gap-2">
                    {["Project", "Design"].map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          setEditingProject({
                            ...editingProject,
                            tab: t as "Project" | "Design",
                          })
                        }
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                          editingProject.tab === t
                            ? "gradient-bg text-white"
                            : "bg-[#1e2535] text-slate-400 border border-[#2e3a50]"
                        }`}
                      >
                        {t === "Project" ? "🎮 Game/Project" : "🎨 Design"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editingProject.title}
                    onChange={(v) => setEditingProject({ ...editingProject, title: v })}
                    placeholder="Open World Gym"
                  />
                </div>
                <div>
                  <Label>Slug (URL-friendly name)</Label>
                  <Input
                    value={editingProject.slug}
                    onChange={(v) => setEditingProject({ ...editingProject, slug: v })}
                    placeholder="open-world-gym"
                  />
                </div>
                <div>
                  <Label>
                    Image Key{" "}
                    <span className="text-slate-500 normal-case font-normal">
                      (key from assets.ts → myLatestProject.projects)
                    </span>
                  </Label>
                  <Input
                    value={editingProject.imageKey}
                    onChange={(v) => setEditingProject({ ...editingProject, imageKey: v })}
                    placeholder="gym"
                  />
                </div>
                <div>
                  <Label>
                    Image URL{" "}
                    <span className="text-slate-500 normal-case font-normal">
                      (paste a URL to use instead of local file)
                    </span>
                  </Label>
                  <Input
                    value={editingProject.imageUrl}
                    onChange={(v) => setEditingProject({ ...editingProject, imageUrl: v })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>GitHub / Repository URL</Label>
                  <Input
                    value={editingProject.repositoryUrl}
                    onChange={(v) =>
                      setEditingProject({ ...editingProject, repositoryUrl: v })
                    }
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <Label>Demo / Live URL</Label>
                  <Input
                    value={editingProject.demoUrl}
                    onChange={(v) => setEditingProject({ ...editingProject, demoUrl: v })}
                    placeholder="https://itch.io/..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveProject(editingProject)}
                  disabled={saving}
                  className="flex-1 gradient-btn rounded-xl py-2.5 text-sm font-bold disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Project"}
                </button>
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#2e3a50] text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ TECH MODAL ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editingTech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setEditingTech(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161d2f] border border-[#2e3a50] rounded-2xl p-7 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-5">
                {data.technologies.find((t) => t.id === editingTech.id)
                  ? "Edit Technology"
                  : "New Technology"}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editingTech.name}
                    onChange={(v) => setEditingTech({ ...editingTech, name: v })}
                    placeholder="Blender"
                  />
                </div>
                <div>
                  <Label>
                    Image Key{" "}
                    <span className="text-slate-500 normal-case font-normal">
                      (from assets.ts → technologyStack)
                    </span>
                  </Label>
                  <Input
                    value={editingTech.imageKey}
                    onChange={(v) => setEditingTech({ ...editingTech, imageKey: v })}
                    placeholder="blender"
                  />
                </div>
                <div>
                  <Label>Official Site URL</Label>
                  <Input
                    value={editingTech.officialSite}
                    onChange={(v) => setEditingTech({ ...editingTech, officialSite: v })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>Icon URL <span className="text-slate-500 normal-case font-normal">(paste a direct image URL, or upload below)</span></Label>
                  <Input
                    value={editingTech.imageUrl}
                    onChange={(v) => setEditingTech({ ...editingTech, imageUrl: v })}
                    placeholder="https://... or /tech-icons/unity.png"
                  />
                </div>
                <div>
                  <Label>Upload Icon (PNG/JPG/SVG)</Label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setTechIconDragging(true); }}
                    onDragLeave={() => setTechIconDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setTechIconDragging(false);
                      const dropped = e.dataTransfer.files[0];
                      if (dropped && ['image/png', 'image/jpeg', 'image/svg+xml'].includes(dropped.type)) {
                        setTechIconFile(dropped);
                      } else {
                        showToast('Please drop an image file (PNG/JPG/SVG)', 'error');
                      }
                    }}
                    onClick={() => techIconInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      techIconDragging
                        ? 'border-purple-500 bg-purple-500/10'
                        : techIconFile
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-[#2e3a50] hover:border-purple-500/60'
                    }`}
                  >
                    <input
                      ref={techIconInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setTechIconFile(f);
                      }}
                    />
                    <div className="text-2xl mb-2">{techIconFile ? '🎨' : '🖼️'}</div>
                    {techIconFile ? (
                      <>
                        <p className="text-xs text-emerald-400 font-semibold">{techIconFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); uploadTechIcon(); }}
                          disabled={techIconUploading}
                          className="mt-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors disabled:opacity-50"
                        >
                          {techIconUploading ? 'Uploading...' : 'Upload Icon'}
                        </button>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500">Drag icon or click to browse</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveTech(editingTech)}
                  disabled={saving}
                  className="flex-1 gradient-btn rounded-xl py-2.5 text-sm font-bold disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => setEditingTech(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#2e3a50] text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ DELETE CONFIRM ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#161d2f] border border-red-500/40 rounded-2xl p-7 w-full max-w-sm shadow-2xl"
            >
              <div className="text-3xl mb-3">🗑️</div>
              <h3 className="text-lg font-bold mb-2">Delete this item?</h3>
              <p className="text-slate-400 text-sm mb-6">
                This cannot be undone. The item will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const projectMatch = data.projects.find((p) => p.id === deleteConfirm);
                    if (projectMatch) deleteProject(deleteConfirm);
                    else deleteTech(deleteConfirm);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#2e3a50] text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
