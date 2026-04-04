import React from "react";
import { MessageSquare, FileText, Brain, BookOpen, ArrowRight, Sparkles, GraduationCap, Clock, Target } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const FeatureCard = ({ icon: Icon, title, description, onClick, color }: { icon: any, title: string, description: string, onClick: () => void, color: string }) => (
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
      <span>Get Started</span>
      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </motion.button>
);

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const stats = [
    { icon: GraduationCap, label: "Courses", value: "4 Active" },
    { icon: Clock, label: "Study Time", value: "12.5 hrs" },
    { icon: Target, label: "Goals", value: "85% Met" },
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
            Elevate Your Learning with SmartStudy AI
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed max-w-xl">
            Your personal AI-powered study assistant. Generate summaries, quizzes, and flashcards in seconds to master any subject.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => setActiveTab("chat")}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Start Chatting
            </button>
            <button 
              onClick={() => setActiveTab("summarizer")}
              className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-400 transition-colors border border-indigo-400"
            >
              Try Summarizer
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
          <h2 className="text-2xl font-bold text-slate-900">Study Tools</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={MessageSquare}
            title="AI Tutor"
            description="Get instant answers and explanations for any study topic."
            color="bg-blue-100 text-blue-600"
            onClick={() => setActiveTab("chat")}
          />
          <FeatureCard
            icon={FileText}
            title="Summarizer"
            description="Turn long articles and notes into concise summaries."
            color="bg-purple-100 text-purple-600"
            onClick={() => setActiveTab("summarizer")}
          />
          <FeatureCard
            icon={Brain}
            title="Quiz Gen"
            description="Test your knowledge with AI-generated quizzes."
            color="bg-amber-100 text-amber-600"
            onClick={() => setActiveTab("quiz")}
          />
          <FeatureCard
            icon={BookOpen}
            title="Flashcards"
            description="Master concepts with interactive AI flashcards."
            color="bg-emerald-100 text-emerald-600"
            onClick={() => setActiveTab("flashcards")}
          />
        </div>
      </div>

      {/* Recent Activity / Recommendations */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl font-bold">Ready to ace your exams?</h2>
            <p className="text-slate-400 leading-relaxed">
              Join thousands of students using SmartStudy to optimize their learning process and save hours of study time every week.
            </p>
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/50">
              Get Started for Free
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-slate-400">Success Rate</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <p className="text-2xl font-bold">50k+</p>
                <p className="text-xs text-slate-400">Active Users</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-slate-400">AI Support</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <p className="text-2xl font-bold">100+</p>
                <p className="text-xs text-slate-400">Subjects</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.2),transparent)]" />
      </div>
    </div>
  );
}
