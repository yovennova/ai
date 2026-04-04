import React, { useState } from "react";
import { BookOpen, Loader2, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { generateFlashcards } from "@/src/services/gemini";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Flashcard {
  front: string;
  back: string;
}

export default function Flashcards() {
  const [text, setText] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generateFlashcards(text);
      setCards(result || []);
      setCurrentIdx(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Flashcards error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIdx < cards.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Flashcards</h2>
        <p className="text-slate-500 max-w-2xl">
          Convert your notes into interactive flashcards. Perfect for active recall and memorization.
        </p>
      </div>

      {!cards.length ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your study material here..."
              className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all text-slate-700"
            />
            <button
              onClick={handleGenerate}
              disabled={!text.trim() || isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Generating Flashcards...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Flashcards</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Card {currentIdx + 1} of {cards.length}
            </span>
            <button 
              onClick={() => setCards([])}
              className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <div className="relative h-96 perspective-1000">
            <motion.div
              className="w-full h-full relative preserve-3d cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center p-12 text-center group">
                <div className="absolute top-6 left-6 text-xs font-bold text-slate-300 uppercase tracking-widest">Front</div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  {cards[currentIdx].front}
                </h3>
                <div className="absolute bottom-8 text-xs text-slate-400 font-medium group-hover:text-indigo-500 transition-colors">
                  Click to flip
                </div>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden bg-indigo-600 border-2 border-indigo-700 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center p-12 text-center text-white"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="absolute top-6 left-6 text-xs font-bold text-indigo-300 uppercase tracking-widest">Back</div>
                <p className="text-xl font-medium leading-relaxed">
                  {cards[currentIdx].back}
                </p>
                <div className="absolute bottom-8 text-xs text-indigo-300 font-medium">
                  Click to flip back
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={prevCard}
              disabled={currentIdx === 0}
              className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextCard}
              disabled={currentIdx === cards.length - 1}
              className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
