import React, { useState } from "react";
import { FileText, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { generateSummary } from "@/src/services/gemini";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../contexts/LanguageContext";

export default function Summarizer() {
  const { t, language } = useLanguage();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const langInstruction = language === "am" ? " Please summarize in Amharic." : "";
      const result = await generateSummary(text + langInstruction);
      setSummary(result || "");
    } catch (error) {
      console.error("Summary error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t.summarizerTitle}</h2>
        <p className="text-slate-500 max-w-2xl">
          {t.summarizerSubtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.summarizePlaceholder}
              className="w-full h-96 p-6 bg-white border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none shadow-sm transition-all text-slate-700 leading-relaxed"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400">
              {text.length} characters
            </div>
          </div>
          <button
            onClick={handleSummarize}
            disabled={!text.trim() || isLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{t.summarizing}</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>{t.generateSummary}</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="relative min-h-[400px] bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {summary ? (
            <>
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 text-indigo-600">
                  <FileText size={18} />
                  <span className="font-semibold text-sm">{t.aiSummary}</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 prose prose-indigo prose-sm max-w-none">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <FileText size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">{t.noSummary}</h3>
                <p className="text-sm text-slate-500">
                  {t.summaryWillAppear}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
