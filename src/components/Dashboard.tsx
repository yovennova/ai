import React from "react";
import { MessageSquare, FileText, Brain, BookOpen, ArrowRight, Sparkles, GraduationCap, Clock, Target, Compass } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const FeatureCard = ({ icon: Icon, title, description, onClick, color, getStartedText }: { icon: any, title: string, description: string, onClick: () => void, color: string, getStartedText: string }) => (
  <motion.button
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left group"
  >
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-4">{description}</p>
    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
      <span>{getStartedText}</span>
      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </motion.button>
);

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { t } = useLanguage();

  const stats = [
    { icon: GraduationCap, label: t.courses, value: `4 ${t.active}` },
    { icon: Clock, label: t.studyTime, value: "12.5 hrs" },
    { icon: Target, label: t.goals, value: `85% ${t.met}` },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-indigo-600 rounded-[2.5rem] p-10 lg:p-16 text-white shadow-2xl shadow-indigo-200">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/30 backdrop-blur-md rounded-full text-sm font-medium border border-indigo-400/30">
            <Sparkles size={16} />
            <span>Powered by Gemini AI</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed max-w-xl">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => setActiveTab("chat")}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-lg cursor-pointer"
            >
              {t.startChatting}
            </button>
            <button 
              onClick={() => setActiveTab("summarizer")}
              className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-400 transition-colors border border-indigo-400 cursor-pointer"
            >
              {t.trySummarizer}
            </button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-y-1/4 w-64 h-64 bg-indigo-300/10 rounded-full blur-2xl" />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-slate-900">{t.studyTools}</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{t.viewAll}</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <FeatureCard
            icon={MessageSquare}
            title={t.aiTutor}
            description={t.chatDescription}
            color="bg-blue-100 text-blue-600"
            onClick={() => setActiveTab("chat")}
            getStartedText={t.startChatting}
          />
          <FeatureCard
            icon={FileText}
            title={t.summarizer}
            description={t.summarizerSubtitle}
            color="bg-purple-100 text-purple-600"
            onClick={() => setActiveTab("summarizer")}
            getStartedText={t.trySummarizer}
          />
          <FeatureCard
            icon={Brain}
            title={t.quizGenerator}
            description={t.quizSubtitle}
            color="bg-amber-100 text-amber-600"
            onClick={() => setActiveTab("quiz")}
            getStartedText={t.generateQuiz}
          />
          <FeatureCard
            icon={BookOpen}
            title={t.flashcards}
            description={t.flashcardsSubtitle}
            color="bg-emerald-100 text-emerald-600"
            onClick={() => setActiveTab("flashcards")}
            getStartedText={t.generateFlashcards}
          />
          <FeatureCard
            icon={Compass}
            title={t.resourcesTitle}
            description={t.resourcesSubtitle}
            color="bg-rose-100 text-rose-600"
            onClick={() => setActiveTab("resources")}
            getStartedText={t.findResources}
          />
        </div>
      </div>

      {/* Recommendations & Success Statistics (No 50k+ Card) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl font-bold">{t.readyToAce}</h2>
            <p className="text-slate-400 leading-relaxed">
              {t.joinThousands}
            </p>
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/50 cursor-pointer">
              {t.getStartedFree}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 text-center sm:text-left min-w-[140px]">
              <p className="text-3xl font-extrabold text-white">98%</p>
              <p className="text-xs text-slate-400 mt-1">{t.successRate}</p>
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 text-center sm:text-left min-w-[140px]">
              <p className="text-3xl font-extrabold text-white">24/7</p>
              <p className="text-xs text-slate-400 mt-1">{t.aiSupport}</p>
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 text-center sm:text-left min-w-[140px]">
              <p className="text-3xl font-extrabold text-white">100+</p>
              <p className="text-xs text-slate-400 mt-1">{t.subjects}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.2),transparent)]" />
      </div>
    </div>
  );
}
