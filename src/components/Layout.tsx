import React, { useState } from "react";
import { BookOpen, MessageSquare, FileText, Brain, LayoutDashboard, Menu, X, Globe, Compass } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left cursor-pointer",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-600 hover:bg-slate-100"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { id: "home", label: t.dashboard, icon: LayoutDashboard },
    { id: "chat", label: t.aiTutor, icon: MessageSquare },
    { id: "summarizer", label: t.summarizer, icon: FileText },
    { id: "quiz", label: t.quizGenerator, icon: Brain },
    { id: "flashcards", label: t.flashcards, icon: BookOpen },
    { id: "resources", label: t.resources, icon: Compass },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white text-slate-900 rounded-lg shadow-md border border-slate-200 cursor-pointer"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative z-40 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-950">{t.appName}</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="mt-auto pt-6 space-y-4">
            {/* Language Toggle */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <Globe size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">{t.language}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                    language === "en" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("am")}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer",
                    language === "am" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  አማ
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100/10">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">{t.proTip}</p>
              <p className="text-sm text-indigo-900 leading-relaxed">
                {t.proTipText}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
