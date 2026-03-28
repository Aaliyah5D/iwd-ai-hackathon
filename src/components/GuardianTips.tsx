import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Loader2, User, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface GuardianTipsProps {
  initialContext: string;
  onClose: () => void;
}

export function GuardianTips({ initialContext, onClose }: GuardianTipsProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial AI message based on context
    const getInitialTips = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Provide immediate, actionable safety tips for a guardian helping with: ${initialContext}. Keep it concise and professional.`,
          config: {
            systemInstruction: "You are an emergency response AI for the SYNK app. Provide calm, expert advice for campus safety situations.",
          },
        });
        
        if (response.text) {
          setMessages([{ role: 'model', text: response.text }]);
        }
      } catch (error) {
        console.error('AI Error:', error);
        setMessages([{ role: 'model', text: "I'm having trouble connecting right now. Please stay calm and follow standard safety protocols." }]);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialTips();
  }, [initialContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are an emergency response AI for the SYNK app. The current situation is: ${initialContext}. Provide calm, expert advice.`,
        },
      });

      // Send history + new message
      const response = await chat.sendMessage({ message: userMessage });
      
      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I couldn't process that. Please focus on the immediate safety of the person you're helping." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-4 bottom-24 z-50 md:inset-x-auto md:right-8 md:w-96"
    >
      <div className="bg-white rounded-[32px] border-[3px] border-mint shadow-2xl flex flex-col h-[500px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b-2 border-mint/10 flex items-center justify-between bg-mint/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mint/20 rounded-xl flex items-center justify-center text-mint-dark">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-black text-sm text-text">Guardian AI</h3>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Live Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mint/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-mint text-mint-dark'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-xs font-bold shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-text rounded-tl-none border border-mint/10'
                  }`}>
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl border border-mint/10 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-mint-dark" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t-2 border-mint/10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for more tips..."
              className="w-full bg-secondary border-2 border-transparent focus:border-mint rounded-2xl py-3 pl-4 pr-12 text-xs font-bold outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-mint text-mint-dark rounded-xl flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
