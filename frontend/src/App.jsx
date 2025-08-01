import React, { useState, useEffect } from 'react';
import { Upload, MessageSquare, Zap, Volume2, Eye, EyeOff, Gamepad2, RefreshCw } from 'lucide-react';
import ChatAnalyzer from './components/ChatAnalyzer';
import ReplyGenerator from './components/ReplyGenerator';
import RizzGame from './components/RizzGame';

function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [stealthMode, setStealthMode] = useState(false);
  const [chatData, setChatData] = useState(null);

  useEffect(() => {
    document.body.className = stealthMode ? 'stealth-mode' : '';
  }, [stealthMode]);

  const tabs = [
    { id: 'analyzer', label: 'Chat Analyzer', icon: MessageSquare },
    { id: 'replies', label: 'AI Replies', icon: Zap },
    { id: 'game', label: 'Rizz Game', icon: Gamepad2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-jet-black via-purple-900 to-jet-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ice-blue/20 to-electric-purple/20 opacity-30"></div>
        <div className="relative z-10 text-center py-20 px-4">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <h1 className={`text-6xl font-orbitron font-black ${stealthMode ? 'text-gray-800' : 'gradient-text'} animate-float`}>
              {stealthMode ? 'Notes App' : 'Rizzicle'}
            </h1>
            <button
              onClick={() => setStealthMode(!stealthMode)}
              className="p-2 rounded-lg glassmorphism hover:bg-white/20 transition-all duration-300"
              title="Toggle Stealth Mode"
            >
              {stealthMode ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
            </button>
          </div>
          {!stealthMode && (
            <p className="text-2xl font-inter text-ice-blue/80 mb-8">
              Cold Replies. Hot Results. 🔥
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-8">
        <div className="glassmorphism p-2 rounded-2xl">
          <div className="flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-ice-blue to-electric-purple text-white shadow-lg' 
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            <ChatAnalyzer onChatAnalyzed={setChatData} stealthMode={stealthMode} />
          </div>
        )}
        
        {activeTab === 'replies' && (
          <ReplyGenerator chatData={chatData} stealthMode={stealthMode} />
        )}
        
        {activeTab === 'game' && (
          <RizzGame />
        )}
      </div>
    </div>
  );
}

export default App;