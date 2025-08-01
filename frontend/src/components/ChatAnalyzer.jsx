import React, { useState } from 'react';
import { Upload, MessageSquare, FileImage, Loader, CheckCircle, Zap } from 'lucide-react';
import Tesseract from 'tesseract.js';

const ChatAnalyzer = ({ onChatAnalyzed, stealthMode }) => {
  const [inputMethod, setInputMethod] = useState('text');
  const [chatText, setChatText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [analyzed, setAnalyzed] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setAnalyzed(false);
    }
  };

  const processImage = async () => {
    if (!imageFile) return;
    
    setProcessing(true);
    setOcrProgress(0);

    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      const extractedText = result.data.text;
      const lines = extractedText.split('\n').filter(line => line.trim().length > 0);
      const lastMessages = lines.slice(-10); // Get last 10 lines

      setChatText(lastMessages.join('\n'));
      
      // Automatically analyze after extraction
      const chatData = {
        originalText: lastMessages.join('\n'),
        lines: lastMessages,
        messageCount: lastMessages.length,
        timestamp: new Date().toISOString()
      };
      
      onChatAnalyzed(chatData);
      setAnalyzed(true);
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process image. Please try again or use text input.');
    } finally {
      setProcessing(false);
      setOcrProgress(0);
    }
  };

  const handleTextAnalysis = () => {
    if (chatText.trim()) {
      const lines = chatText.split('\n').filter(line => line.trim().length > 0);
      const chatData = {
        originalText: chatText,
        lines: lines,
        messageCount: lines.length,
        timestamp: new Date().toISOString()
      };
      
      onChatAnalyzed(chatData);
      setAnalyzed(true);
    }
  };

  return (
    <div className="glassmorphism p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-orbitron font-bold mb-4 ${stealthMode ? 'text-gray-800' : 'gradient-text'}`}>
          {stealthMode ? 'Text Input' : 'Chat Input 📱'}
        </h2>
        <p className="text-gray-300">Upload a screenshot or paste your chat to get started</p>
      </div>

      {/* Input Method Selector */}
      <div className="flex justify-center mb-8">
        <div className="glassmorphism p-2 rounded-xl">
          <div className="flex space-x-2">
            <button
              onClick={() => setInputMethod('text')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                inputMethod === 'text' 
                  ? 'bg-ice-blue text-white' 
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => setInputMethod('image')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                inputMethod === 'image' 
                  ? 'bg-electric-purple text-white' 
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <FileImage className="w-5 h-5" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Text Input */}
      {inputMethod === 'text' && (
        <div className="space-y-4">
          <textarea
            value={chatText}
            onChange={(e) => {
              setChatText(e.target.value);
              setAnalyzed(false);
            }}
            placeholder="Paste your chat messages here... (last 6-10 messages work best)"
            className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-ice-blue focus:ring-2 focus:ring-ice-blue/20"
          />
          <div className="text-center">
            <button
              onClick={handleTextAnalysis}
              disabled={!chatText.trim()}
              className="px-8 py-3 bg-gradient-to-r from-ice-blue to-electric-purple text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Process Chat
            </button>
          </div>
        </div>
      )}

      {/* Image Upload */}
      {inputMethod === 'image' && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-ice-blue/50 rounded-xl p-8 text-center hover:border-ice-blue transition-colors duration-300">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-ice-blue" />
              <p className="text-lg font-medium text-white mb-2">
                Click to upload screenshot
              </p>
              <p className="text-gray-400">PNG, JPG up to 10MB</p>
            </label>
          </div>

          {imageFile && (
            <div className="text-center space-y-4">
              <div className="glassmorphism p-4 rounded-xl">
                <p className="text-white mb-2">📱 {imageFile.name}</p>
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Preview" 
                  className="max-h-40 mx-auto rounded-lg"
                />
              </div>
              
              {processing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin text-ice-blue" />
                    <span className="text-white">Processing image... {ocrProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-ice-blue to-electric-purple h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={processImage}
                  className="px-8 py-3 bg-gradient-to-r from-electric-purple to-ice-blue text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
                >
                  <FileImage className="w-5 h-5 inline mr-2" />
                  Extract Text from Image
                </button>
              )}
            </div>
          )}

          {chatText && (
            <div className="glassmorphism p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-white">Extracted Text:</span>
              </div>
              <div className="bg-black/30 p-3 rounded-lg text-sm text-gray-300 max-h-32 overflow-y-auto">
                {chatText}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {analyzed && (
        <div className="mt-6 glassmorphism p-4 rounded-xl text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
          <p className="text-green-400 font-semibold">Chat processed successfully!</p>
          <p className="text-gray-300 text-sm">Now go to "AI Replies" tab to generate responses</p>
        </div>
      )}
    </div>
  );
};

export default ChatAnalyzer;