import React, { useState } from "react";
import { Brain, Loader2, CheckCircle2, XCircle, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react";
import { generateQuiz } from "@/src/services/gemini";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuizGenerator() {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await generateQuiz(text);
      setQuestions(result || []);
      setCurrentIdx(0);
      setSelectedOption(null);
      setShowResult(false);
      setScore(0);
    } catch (error) {
      console.error("Quiz error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === questions[currentIdx].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setText("");
    setShowResult(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Quiz Generator</h2>
        <p className="text-slate-500 max-w-2xl">
          Test your knowledge! Paste your study material and I'll generate a custom quiz for you.
        </p>
      </div>

      {!questions.length ? (
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
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <Brain size={20} />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : showResult ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center space-y-8"
        >
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
            <Brain size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-900">Quiz Completed!</h3>
            <p className="text-slate-500">You scored {score} out of {questions.length}</p>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(score / questions.length) * 100}%` }}
              className="bg-indigo-600 h-full"
            />
          </div>
          <button
            onClick={resetQuiz}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 mx-auto transition-all shadow-lg shadow-indigo-100"
          >
            <RefreshCw size={20} />
            <span>Try Another Quiz</span>
          </button>
        </motion.div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex gap-1">
              {questions.map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentIdx ? "w-6 bg-indigo-600" : idx < currentIdx ? "bg-indigo-200" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
          </div>

          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
              {questions[currentIdx].question}
            </h3>

            <div className="grid gap-4">
              {questions[currentIdx].options.map((option, idx) => {
                const isCorrect = option === questions[currentIdx].answer;
                const isSelected = selectedOption === option;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    disabled={!!selectedOption}
                    className={cn(
                      "w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between group",
                      !selectedOption 
                        ? "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30" 
                        : isSelected
                          ? isCorrect ? "border-green-500 bg-green-50 text-green-900" : "border-red-500 bg-red-50 text-red-900"
                          : isCorrect ? "border-green-500 bg-green-50 text-green-900" : "border-slate-100 opacity-50"
                    )}
                  >
                    <span className="font-medium">{option}</span>
                    {selectedOption && isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                    {selectedOption && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedOption && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-2"
                >
                  <p className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Explanation</p>
                  <p className="text-indigo-800 leading-relaxed">{questions[currentIdx].explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end pt-4">
              <button
                onClick={nextQuestion}
                disabled={!selectedOption}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
              >
                <span>{currentIdx === questions.length - 1 ? "Finish Quiz" : "Next Question"}</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
