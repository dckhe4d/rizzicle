import React, { useState, useEffect } from 'react';
import { Zap, Volume2, Brain, Copy, CheckCircle } from 'lucide-react';

const ReplyGenerator = ({ chatData, stealthMode }) => {
  const [language, setLanguage] = useState('english');
  const [selectedTones, setSelectedTones] = useState(['flirty', 'teasing']);
  const [selectedMood, setSelectedMood] = useState('interested');
  const [replies, setReplies] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const languages = [
    { id: 'english', label: 'English', flag: '🇬🇧' },
    { id: 'hinglish', label: 'Hinglish', flag: '🇮🇳' }
  ];

  const tones = [
    { id: 'flirty', label: 'Flirty', emoji: '😏', color: 'text-pink-400' },
    { id: 'teasing', label: 'Teasing', emoji: '😜', color: 'text-purple-400' },
    { id: 'direct', label: 'Direct', emoji: '😈', color: 'text-red-400' },
    { id: 'witty', label: 'Witty', emoji: '⚡', color: 'text-yellow-400' },
    { id: 'sweet', label: 'Sweet', emoji: '🧸', color: 'text-pink-300' },
    { id: 'savage', label: 'Savage', emoji: '🔥', color: 'text-orange-400' }
  ];

  const moods = [
    { id: 'flirty', label: 'Flirty', emoji: '💋' },
    { id: 'interested', label: 'Interested', emoji: '👀' },
    { id: 'dry', label: 'Dry', emoji: '🧂' },
    { id: 'ignoring', label: 'Ignoring', emoji: '🧊' },
    { id: 'sad', label: 'Sad', emoji: '😔' },
    { id: 'angry', label: 'Angry', emoji: '😤' },
    { id: 'bored', label: 'Bored', emoji: '😴' },
    { id: 'confused', label: 'Confused', emoji: '😵‍💫' },
    { id: 'funny', label: 'Funny', emoji: '😂' }
  ];

  const generateReplies = async () => {
    if (!chatData) {
      alert('Please add some chat text first! Go to "Chat Analyzer" tab.');
      return;
    }

    setGenerating(true);
    setReplies([]);

    try {
      const response = await fetch('/api/generate-replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatText: chatData.originalText,
          mood: selectedMood,
          tones: selectedTones
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setReplies(result.replies || []);
    } catch (error) {
      console.error('Reply generation error:', error);
      // Use client-side fallback when API fails
      setReplies(generateClientFallbackReplies());
    } finally {
      setGenerating(false);
    }
  };

  const generateClientFallbackReplies = () => {
    const fallbackReplies = {
      flirty: {
        replies: [
          "Your energy is everything ✨",
          "Keep talking, I'm listening 👀",
          "You're making this interesting 😏"
        ]
      },
      teasing: {
        replies: [
          "Oh really? Tell me more 🤔",
          "Someone's being mysterious today 😜",
          "That's what you think 😏"
        ]
      },
      direct: {
        replies: [
          "Let's be honest here 💯",
          "Cut to the chase",
          "No games, just truth 🎯"
        ]
      },
      witty: {
        replies: [
          "Careful, my brain is loading ⚡",
          "That's... actually smart 🧠",
          "Plot twist incoming 🎭"
        ]
      },
      sweet: {
        replies: [
          "You're so thoughtful 🥺",
          "That's actually really sweet 💕",
          "You made my day better ☀️"
        ]
      },
      savage: {
        replies: [
          "That's a bold move 🔥",
          "Someone's feeling spicy today 🌶️",
          "Shots fired 💥"
        ]
      }
    };

    return selectedTones.map(tone => {
      const toneReplies = fallbackReplies[tone].replies;
      const randomReply = toneReplies[Math.floor(Math.random() * toneReplies.length)];
      return {
        tone: tone,
        reply: randomReply
      };
    });
  };

  const speakReply = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const copyReply = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleTone = (toneId) => {
    setSelectedTones(prev => 
      prev.includes(toneId) 
        ? prev.filter(t => t !== toneId)
        : [...prev, toneId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Chat Preview */}
      {chatData && (
        <div className="glassmorphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-3">📱 Your Chat:</h3>
          <div className="bg-black/30 p-4 rounded-xl text-gray-300 text-sm max-h-32 overflow-y-auto">
            {chatData.originalText}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {chatData.messageCount} messages • Ready for reply generation
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <div className="glassmorphism p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-orbitron font-bold mb-4 ${stealthMode ? 'text-gray-800' : 'gradient-text'}`}>
            {stealthMode ? 'Reply Generator' : 'AI Reply Generator ⚡'}
          </h2>
          <p className="text-gray-300">Configure your perfect response style</p>
        </div>

        {/* Mood Selector */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Their Mood (Select what you think they're feeling)</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-3 rounded-xl text-center transition-all duration-300 ${
                  selectedMood === mood.id
                    ? 'bg-gradient-to-r from-ice-blue to-electric-purple text-white scale-105' 
                    : 'glassmorphism hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Reply Tones (Select up to 4)</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {tones.map(tone => (
              <button
                key={tone.id}
                onClick={() => toggleTone(tone.id)}
                disabled={!selectedTones.includes(tone.id) && selectedTones.length >= 4}
                className={`p-3 rounded-xl text-center transition-all duration-300 ${
                  selectedTones.includes(tone.id)
                    ? 'bg-gradient-to-r from-ice-blue to-electric-purple text-white scale-105' 
                    : 'glassmorphism hover:bg-white/10 text-gray-300 disabled:opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{tone.emoji}</div>
                <div className="text-xs font-medium">{tone.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={generateReplies}
            disabled={generating || selectedTones.length === 0 || !chatData}
            className="px-8 py-4 bg-gradient-to-r from-ice-blue to-electric-purple text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
          >
            {generating ? (
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 animate-spin" />
                <span>Generating Magic...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Generate Replies</span>
              </div>
            )}
          </button>
          {!chatData && (
            <p className="text-red-400 text-sm mt-2">⚠️ Please add chat text first in "Chat Analyzer" tab</p>
          )}
        </div>
      </div>

      {/* Generated Replies */}
      {replies.length > 0 && (
        <div className="glassmorphism p-8 rounded-3xl shadow-2xl">
          <h3 className="text-2xl font-orbitron font-bold gradient-text mb-6 text-center">
            Your AI-Generated Replies 🎯
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            {replies.map((reply, index) => {
              const tone = tones.find(t => t.id === reply.tone);
              return (
                <div
                  key={index}
                  className="glassmorphism p-6 rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  {/* Tone Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{tone.emoji}</span>
                      <span className={`font-semibold ${tone.color}`}>{tone.label}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => speakReply(reply.reply)}
                        className="p-2 rounded-lg glassmorphism hover:bg-white/20 transition-all duration-300"
                        title="Text to Speech"
                      >
                        <Volume2 className="w-4 h-4 text-ice-blue" />
                      </button>
                    </div>
                  </div>

                  {/* Reply Text */}
                  <div className="bg-black/30 p-4 rounded-xl mb-4">
                    <p className="text-white text-lg font-medium leading-relaxed">
                      {reply.reply}
                    </p>
                  </div>

                  {/* Explanation Box - Separate from reply */}
                  {reply.explanation && (
                    <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">Why this works:</span>
                      </div>
                      <p className="text-blue-200 text-sm">
                        {reply.explanation}
                      </p>
                    </div>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={() => copyReply(reply.reply, index)}
                    className={`w-full px-4 py-2 font-semibold rounded-lg hover:scale-105 transition-all duration-300 ${
                      copiedIndex === index 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    }`}
                  >
                    {copiedIndex === index ? (
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Copy className="w-4 h-4" />
                        <span>Copy Reply</span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Chat Data Message */}
      {!chatData && (
        <div className="glassmorphism p-8 rounded-3xl shadow-2xl text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-2xl font-orbitron font-bold text-gray-400 mb-2">
            No Chat Data
          </h3>
          <p className="text-gray-500 mb-4">Go to "Chat Analyzer" tab and add some chat text first</p>
          <div className="text-sm text-gray-400">
            You can either:
            <br />
            • Upload a screenshot of your chat
            <br />
            • Paste your chat messages directly
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyGenerator;