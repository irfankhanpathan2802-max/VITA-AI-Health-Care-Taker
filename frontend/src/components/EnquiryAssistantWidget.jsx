import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { apiRequest } from '../services/api.js';

export const EnquiryAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your VitaCare Enquiry Concierge. Ask me anything about our platform, healthy food subscriptions, store sourcing, or how we calculate your nutrition.",
      actionLink: null,
      actionText: null,
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const presetEnquiries = [
    'How do subscriptions work?',
    'Where is VitaCare food sourced?',
    'How is my daily protein calculated?',
    'How does the camera food scanner work?',
    'What if I miss breakfast?',
    'How to contact support?',
  ];

  const handleSend = async (textToSend = null) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await apiRequest('/ai/enquiry', {
        method: 'POST',
        body: JSON.stringify({ enquiry: query }),
      });

      if (res.success && res.result) {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: res.result.answer,
          actionLink: res.result.actionLink,
          actionText: res.result.actionText,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'assistant',
            text: "I'm having a brief connection issue. Please feel free to browse our Store or check your Dashboard.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: "I couldn't process that enquiry right now. Please try again or reach out to care@vitacare.health.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING CONCIERGE BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-5 sm:right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-900 to-gray-950 text-white shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 hover:scale-105 transition-all duration-300 active:scale-95 group animate-pulse-glow"
          title="Open VitaCare Enquiry Concierge"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-gray-950 flex items-center justify-center font-black text-xs shadow-md">
            <Sparkles className="w-4 h-4 text-emerald-950 animate-spin-slow" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider block leading-tight">
              Support & Info
            </span>
            <span className="text-xs font-black text-white block leading-tight">
              Ask VitaCare AI
            </span>
          </div>
          <span className="sm:hidden text-xs font-bold">Ask AI</span>
        </button>
      )}

      {/* CONCIERGE DIALOG */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden flex flex-col h-[540px] max-h-[85vh] animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-950 via-emerald-950 to-gray-900 text-white p-4 px-5 flex items-center justify-between border-b border-emerald-900/40 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  VitaCare Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[11px] text-emerald-300/90 font-medium">
                  Platform Questions, Orders & Guidelines
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title="Close Concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBFBFA]/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs font-semibold'
                      : 'bg-white border border-gray-200/80 text-gray-800 rounded-tl-xs space-y-2'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {msg.actionLink && (
                    <Link
                      to={msg.actionLink}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors mt-1"
                    >
                      {msg.actionText || 'View Details'}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-xs text-gray-500 font-medium text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  Searching VitaCare knowledge...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Chips */}
          <div className="p-2.5 px-4 bg-gray-50 border-t border-gray-100">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1.5">
              Suggested Enquiries:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {presetEnquiries.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 border border-gray-200 hover:border-emerald-300 text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 px-4 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask an enquiry about VitaCare..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-sm"
              title="Send enquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
