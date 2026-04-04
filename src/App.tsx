import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ChatInterface from "./components/ChatInterface";
import Summarizer from "./components/Summarizer";
import QuizGenerator from "./components/QuizGenerator";
import Flashcards from "./components/Flashcards";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "chat":
        return <ChatInterface />;
      case "summarizer":
        return <Summarizer />;
      case "quiz":
        return <QuizGenerator />;
      case "flashcards":
        return <Flashcards />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
