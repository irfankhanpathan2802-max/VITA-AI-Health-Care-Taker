import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

export const AICoachPage = () => {
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your VitaCare AI Coach. I provide personalized wellness observations based strictly on your logged nutrition and daily lifestyle. How can I help you today?",
      suggestions: [
        'What did I eat today?',
        'How much protein did I log today?',
        'What should I eat tomorrow?',
        'Why is fiber important?',
        'What protein-rich foods match my diet?',
      ],
      relatedProducts: [],
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText = input) => {
    const text = messageText.trim();
    if (!text || isSending) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsSending(true);

    try {
      const res = await apiRequest('/ai/coach', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });

      if (res.success && res.response) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: res.response.answer,
            suggestions: res.response.suggestions || [],
            relatedProducts: res.response.relatedProducts || [],
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I couldn't process your request right now. Please make sure your backend connection is active and try again.",
          suggestions: [],
          relatedProducts: [],
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[82vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
            VitaCare AI Coach
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Grounded in Real Logs
            </span>
          </h1>
          <p className="text-xs text-gray-500">
            Answers questions using only your actual logged meals and wellness targets. Never invents data.
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5 pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {msg.sender === 'bot' ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}

            <div className="space-y-3">
              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow-xs rounded-tr-xs'
                    : 'bg-white border border-gray-100 shadow-xs text-gray-800 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Related Store Products (AI -> Store connection) */}
              {msg.relatedProducts && msg.relatedProducts.length > 0 && (
                <div className="bg-[#FAFBF9] p-3.5 rounded-2xl border border-gray-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 block">
                    Suitable options available in VitaCare Store:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.relatedProducts.map((prod, pIdx) => (
                      <div key={pIdx} className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center justify-between gap-2">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-[11px] font-bold text-gray-900 truncate">{prod.name}</h5>
                          <span className="text-[11px] font-extrabold text-emerald-700">₹{prod.price}</span>
                        </div>
                        <button
                          onClick={() => addToCart(prod._id, 1)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[10px] font-bold transition-colors"
                        >
                          + Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSend(sug)}
                      className="text-xs px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200/70 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-gray-400 italic">
            <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
            Analyzing your actual data...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-4 border-t border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask about your logged meals, protein intake, fiber..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white shadow-xs"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
