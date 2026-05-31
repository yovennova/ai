import React, { useState } from "react";
import {
  Search,
  Youtube,
  Github,
  BookOpen,
  MessageSquare,
  ExternalLink,
  Loader2,
  Compass,
  Globe,
  GraduationCap,
  School,
  Award,
  Code,
  NotebookPen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { searchResources } from "../services/gemini";
import { cn } from "@/src/lib/utils";

interface Resource {
  title: string;
  url: string;
  source:
    | "youtube"
    | "github"
    | "reddit"
    | "wikipedia"
    | "khanacademy"
    | "mitocw"
    | "coursera"
    | "stackoverflow"
    | "medium"
    | "web";
  description: string;
  authorOrChannel?: string;
}

const QUICK_TOPICS = [
  { label: "⚙️ Photosynthesis", query: "Photosynthesis" },
  { label: "🌌 Quantum Computing", query: "Quantum Physics & Computing" },
  { label: "🧠 Machine Learning", query: "Neural Networks and AI" },
  { label: "🧬 CRISPR Gene Editing", query: "CRISPR and Gene Editing" },
  { label: "🏛️ Ancient Rome", query: "Ancient Roman Empire History" },
  { label: "📐 Calculus Integrals", query: "Calculus Integrals and derivatives" },
];

export default function ResourcesExplorer() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    | "all"
    | "youtube"
    | "github"
    | "reddit"
    | "wikipedia"
    | "khanacademy"
    | "mitocw"
    | "coursera"
    | "stackoverflow"
    | "medium"
    | "web"
  >("all");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setSearchTriggered(true);
    setError(null);
    setQuery(trimmed);

    try {
      const results = await searchResources(trimmed);
      if (Array.isArray(results)) {
        setResources(results);
      } else {
        throw new Error("Invalid results format received");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve resources. Please try searching again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter((res) => {
    if (activeFilter === "all") return true;
    return res.source === activeFilter;
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "youtube":
        return <Youtube size={16} />;
      case "github":
        return <Github size={16} />;
      case "reddit":
        return <MessageSquare size={16} />;
      case "wikipedia":
        return <Globe size={16} />;
      case "khanacademy":
        return <GraduationCap size={16} />;
      case "mitocw":
        return <School size={16} />;
      case "coursera":
        return <Award size={16} />;
      case "stackoverflow":
        return <Code size={16} />;
      case "medium":
        return <NotebookPen size={16} />;
      default:
        return <BookOpen size={16} />;
    }
  };

  const getSourceMetadata = (source: string) => {
    switch (source) {
      case "youtube":
        return {
          label: "YouTube",
          bg: "bg-red-50 hover:bg-red-100/50",
          border: "border-red-100 hover:border-red-200",
          badge: "bg-red-100 text-red-700",
          text: "text-red-650"
        };
      case "github":
        return {
          label: "GitHub",
          bg: "bg-slate-50 hover:bg-slate-100/50",
          border: "border-slate-100 hover:border-slate-200",
          badge: "bg-slate-100 text-slate-800",
          text: "text-slate-700"
        };
      case "reddit":
        return {
          label: "Reddit",
          bg: "bg-orange-50 hover:bg-orange-100/50",
          border: "border-orange-100 hover:border-orange-200",
          badge: "bg-orange-100 text-orange-700",
          text: "text-orange-650"
        };
      case "wikipedia":
        return {
          label: "Wikipedia",
          bg: "bg-cyan-50 hover:bg-cyan-100/50",
          border: "border-cyan-100 hover:border-cyan-200",
          badge: "bg-cyan-100 text-cyan-800",
          text: "text-cyan-700"
        };
      case "khanacademy":
        return {
          label: "Khan Academy",
          bg: "bg-emerald-50 hover:bg-emerald-100/50",
          border: "border-emerald-100 hover:border-emerald-200",
          badge: "bg-emerald-100 text-emerald-800",
          text: "text-emerald-700"
        };
      case "mitocw":
        return {
          label: "MIT OCW",
          bg: "bg-purple-50 hover:bg-purple-100/50",
          border: "border-purple-100 hover:border-purple-200",
          badge: "bg-purple-100 text-purple-800",
          text: "text-purple-700"
        };
      case "coursera":
        return {
          label: "Coursera",
          bg: "bg-blue-50 hover:bg-blue-100/50",
          border: "border-blue-100 hover:border-blue-200",
          badge: "bg-blue-100 text-blue-800",
          text: "text-blue-700"
        };
      case "stackoverflow":
        return {
          label: "StackOverflow",
          bg: "bg-yellow-50 hover:bg-yellow-105/50",
          border: "border-yellow-101 hover:border-yellow-201",
          badge: "bg-yellow-100 text-amber-900 border-amber-200",
          text: "text-amber-800"
        };
      case "medium":
        return {
          label: "Medium",
          bg: "bg-teal-50 hover:bg-teal-100/50",
          border: "border-teal-100 hover:border-teal-200",
          badge: "bg-teal-100 text-teal-800",
          text: "text-teal-700"
        };
      default:
        return {
          label: "Web Portal",
          bg: "bg-indigo-50 hover:bg-indigo-100/50",
          border: "border-indigo-100 hover:border-indigo-200",
          badge: "bg-indigo-100 text-indigo-850",
          text: "text-indigo-700"
        };
    }
  };

  const ALL_FILTER_KEYS = [
    "all",
    "youtube",
    "github",
    "reddit",
    "wikipedia",
    "khanacademy",
    "mitocw",
    "coursera",
    "stackoverflow",
    "medium",
    "web"
  ] as const;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Compass size={32} className="text-indigo-650 animate-pulse" />
          {t.resourcesTitle}
        </h2>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          {t.resourcesSubtitle}
        </p>
      </div>

      {/* Advanced Search Panel */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="relative flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700 font-medium placeholder-slate-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-indigo-100/50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Searching Academic Portals...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Search Websites</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Topics Grid */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Research suggestions:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic.query}
                type="button"
                onClick={() => handleSearch(topic.query)}
                disabled={isLoading}
                className="px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-250 hover:border-indigo-250 text-slate-700 hover:text-indigo-705 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Output Card */}
      {error && (
        <div className="p-5 bg-red-50 border border-red-200 text-red-850 rounded-2xl text-center font-semibold text-sm">
          {error}
        </div>
      )}

      {/* Resources Result Container */}
      {searchTriggered && !isLoading && !error && (
        <div className="space-y-6">
          {/* Enhanced Multi-Site Tab Bar */}
          <div className="space-y-3 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Websites Searched & Matching Guides:
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Topic: <strong className="text-slate-800">{query}</strong>
              </span>
            </div>

            {/* Platform filter buttons wrap */}
            <div className="flex flex-wrap gap-2 pt-1 max-h-72 overflow-y-auto">
              {ALL_FILTER_KEYS.map((filter) => {
                const isActive = activeFilter === filter;
                const count =
                  filter === "all"
                    ? resources.length
                    : resources.filter((r) => r.source === filter).length;

                // Meta colors
                const meta = getSourceMetadata(filter);

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border",
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                        : "bg-white border-slate-205 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span className={cn(isActive ? "text-white" : meta.text)}>
                      {getSourceIcon(filter)}
                    </span>
                    <span className="capitalize">{meta.label}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-extrabold",
                        isActive ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Grid display */}
          <AnimatePresence mode="wait">
            {filteredResources.length > 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredResources.map((resource, index) => {
                  const colors = getSourceMetadata(resource.source);
                  return (
                    <motion.div
                      key={resource.url + index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className={cn(
                        "p-6 rounded-3xl border transition-all flex flex-col justify-between relative bg-white group shadow-sm hover:shadow-md",
                        colors.border,
                        colors.bg
                      )}
                    >
                      <div className="space-y-4">
                        {/* Source info band */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 border border-transparent",
                              colors.badge
                            )}
                          >
                            {getSourceIcon(resource.source)}
                            {colors.label}
                          </span>
                          {resource.authorOrChannel && (
                            <span className="text-xs font-bold text-slate-400 truncate max-w-[200px]" title={resource.authorOrChannel}>
                              @{resource.authorOrChannel}
                            </span>
                          )}
                        </div>

                        {/* Resource Headline & Descriptions */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-lg text-slate-900 leading-snug group-hover:text-indigo-650 transition-colors">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {resource.description}
                          </p>
                        </div>
                      </div>

                      {/* Launch direct link */}
                      <div className="mt-6 pt-4 border-t border-slate-100/50">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          referrerPolicy="no-referrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-650 hover:text-indigo-750 uppercase tracking-widest cursor-pointer transition-colors"
                        >
                          <span>Explore on {colors.label}</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-slate-101 space-y-4"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-350 mx-auto">
                  <Compass size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-700">{t.noResourcesYet}</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto px-4">
                    Wait, there are no results matching this specific website. Select "All" or browse different tabs!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Empty / Splash Landing */}
      {!searchTriggered && !isLoading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 space-y-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
            <Compass size={36} className="animate-bounce" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto px-4">
            <h3 className="font-bold text-2xl text-slate-800">Crawl Popular Educational Portals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instantly find relevant tutorials, reference documentation, video lectures, coding examples,
              and academic communities. Search any topic like <strong>Photosynthesis</strong> above to test!
            </p>
          </div>
        </div>
      )}

      {/* Loading Block */}
      {isLoading && (
        <div className="space-y-6">
          <div className="h-10 bg-slate-150 rounded-xl w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((it) => (
              <div key={it} className="p-6 bg-white rounded-3xl border border-slate-100 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-slate-100 rounded-full w-24" />
                  <div className="h-4 bg-slate-100 rounded-full w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-4/5" />
                </div>
                <div className="h-4 bg-slate-100 rounded w-1/4 mt-4" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
