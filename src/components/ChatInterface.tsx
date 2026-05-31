import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, MessageSquare } from "lucide-react";
import { chatWithAI } from "@/src/services/gemini";
import ReactMarkdown from "react-markdown";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function ChatInterface() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", parts: [{ text: userMessage }] }]);
    setIsLoading(true);

    try {
      // Pass language context to AI
      const langInstruction = language === "am" ? " Please respond in Amharic." : "";
      const response = await chatWithAI(userMessage + langInstruction, messages);
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: response || "" }] }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Sorry, I encountered an error. Please try again." }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-slate-900 transition-colors duration-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
          <Bot size={18} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">{t.chatTitle}</h2>
          <p className="text-xs text-slate-500">{t.chatSubtitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{t.startConversation}</h3>
            <p className="text-sm text-slate-500">
              {t.chatDescription}
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {[t.explainQuantum, t.howToStudy, t.solveMath].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200 transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
              msg.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed shadow-sm-sm",
              msg.role === "user" 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
            )}>
              <div className="prose prose-sm max-w-none prose-indigo">
                <ReactMarkdown>
                  {msg.parts[0].text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 mr-auto">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-600">
              <Bot size={16} />
            </div>
            <div className="bg-slate-100 border border-slate-250 p-4 rounded-2xl rounded-tl-none text-slate-500 flex items-center gap-2 shadow-sm">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">{t.thinking}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-100 transition-colors duration-200">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.typeQuestion}
            className="w-full bg-white text-slate-900 border border-slate-200 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
