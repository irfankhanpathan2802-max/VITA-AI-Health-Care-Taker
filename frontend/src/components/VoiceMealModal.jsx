import React, { useState } from 'react';
import { Mic, MicOff, RefreshCw, CheckCircle2, Edit3, Trash2, X, Volume2 } from 'lucide-react';
import { apiRequest } from '../services/api.js';

export const VoiceMealModal = ({ isOpen, onClose, mealType = 'breakfast', onMealSaved }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState('input'); // 'input' | 'processing' | 'confirm'
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Web Speech API integration
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your sentence directly below.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setIsListening(true);
    setErrorMessage('');

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setIsListening(false);
      handleProcessVoice(speechToText);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setErrorMessage("We couldn't understand the meal. Please try again or type directly.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleProcessVoice = async (textToProcess = transcript) => {
    if (!textToProcess.trim()) {
      setErrorMessage('Please speak or enter what you ate.');
      return;
    }

    setStep('processing');
    setErrorMessage('');

    try {
      const res = await apiRequest('/ai/parse-voice', {
        method: 'POST',
        body: JSON.stringify({ transcript: textToProcess }),
      });

      if (!res.success || !res.understoodItems || res.understoodItems.length === 0) {
        setErrorMessage(res.message || "We couldn't identify the foods from your speech. Please try again.");
        setStep('input');
      } else {
        setParsedData(res);
        setStep('confirm');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process voice input.');
      setStep('input');
    }
  };

  // Allow portion editing in confirmation screen
  const handleQuantityChange = (index, delta) => {
    setParsedData(prev => {
      const newItems = prev.understoodItems.map((item, idx) => {
        if (idx === index) {
          const newQty = Math.max(0.5, item.quantity + delta);
          const ratio = newQty / item.quantity;
          return {
            ...item,
            quantity: Math.round(newQty * 10) / 10,
            calories: Math.round(item.calories * ratio),
            proteinGrams: Math.round(item.proteinGrams * ratio * 10) / 10,
            carbsGrams: Math.round(item.carbsGrams * ratio * 10) / 10,
            fatsGrams: Math.round(item.fatsGrams * ratio * 10) / 10,
            fiberGrams: Math.round(item.fiberGrams * ratio * 10) / 10,
          };
        }
        return item;
      });

      const total = newItems.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        proteinGrams: Math.round((acc.proteinGrams + item.proteinGrams) * 10) / 10,
        carbsGrams: Math.round((acc.carbsGrams + item.carbsGrams) * 10) / 10,
        fatsGrams: Math.round((acc.fatsGrams + item.fatsGrams) * 10) / 10,
        fiberGrams: Math.round((acc.fiberGrams + item.fiberGrams) * 10) / 10,
      }), { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 });

      return {
        ...prev,
        understoodItems: newItems,
        totalEstimatedNutrition: total,
      };
    });
  };

  const handleRemoveItem = (index) => {
    setParsedData(prev => ({
      ...prev,
      understoodItems: prev.understoodItems.filter((_, idx) => idx !== index),
    }));
  };

  const handleConfirmSave = async () => {
    if (!parsedData || parsedData.understoodItems.length === 0) {
      alert('Please have at least one food item.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await apiRequest('/meals', {
        method: 'POST',
        body: JSON.stringify({
          mealType: parsedData.understoodMealType || mealType,
          source: 'voice',
          items: parsedData.understoodItems,
          notes: `Voice input: "${parsedData.originalTranscript}"`,
          timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }),
      });

      if (res.success) {
        if (onMealSaved) onMealSaved(res.meal);
        handleClose();
      }
    } catch (err) {
      alert('Failed to save meal: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    setTranscript('');
    setIsListening(false);
    setParsedData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Voice Meal Logging
          </span>
          <h3 className="text-xl font-extrabold text-gray-900 mt-2">Speak Your Meal</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Tell VitaCare what you ate and review before saving.
          </p>
        </div>

        {/* STEP 1: INPUT */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* Mic button */}
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={startListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/30 hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              <span className="text-xs font-bold text-gray-600 mt-3">
                {isListening ? 'Listening... Speak now' : 'Tap to Start Speaking'}
              </span>
            </div>

            {/* Direct text input alternative */}
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Or type what you ate:
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder='e.g. "I had two eggs, two rotis and dal for breakfast"'
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-800 resize-none h-20"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
                {errorMessage}
              </p>
            )}

            {/* Quick sample speech prompts */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-1.5">Try sample sentence:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    const text = 'I had two eggs, two rotis and dal for breakfast';
                    setTranscript(text);
                    handleProcessVoice(text);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 transition-colors"
                >
                  "2 eggs, 2 rotis and dal for breakfast"
                </button>
                <button
                  onClick={() => {
                    const text = 'I had a bowl of ragi java and sprouted moong salad for lunch';
                    setTranscript(text);
                    handleProcessVoice(text);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 transition-colors"
                >
                  "Ragi java and sprouted salad for lunch"
                </button>
              </div>
            </div>

            <button
              onClick={() => handleProcessVoice(transcript)}
              disabled={!transcript.trim()}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm disabled:opacity-50"
            >
              Understand Meal
            </button>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 'processing' && (
          <div className="py-12 text-center">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h4 className="text-base font-bold text-gray-900">Understanding Speech...</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
              Extracting food items, quantities, and calculating estimated nutrition.
            </p>
          </div>
        )}

        {/* STEP 3: CONFIRMATION & PORTION ADJUSTMENT */}
        {step === 'confirm' && parsedData && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
              <span className="text-xs font-bold text-blue-900 block mb-0.5">
                We understood your meal as:
              </span>
              <p className="text-xs text-blue-700 italic">
                "{parsedData.originalTranscript}"
              </p>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {parsedData.understoodItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBFA] border border-gray-100">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">{item.name}</h5>
                    <span className="text-[11px] text-gray-500">
                      {item.calories} kcal • {item.proteinGrams}g Protein
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => handleQuantityChange(idx, -1)}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 font-semibold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(idx, 1)}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="text-gray-400 hover:text-rose-600 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Nutrition */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-emerald-950">Total Estimated Nutrition</span>
                <span className="text-xs font-extrabold text-emerald-700">{parsedData.totalEstimatedNutrition.calories} kcal</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-800 font-semibold">
                <span>Protein: {parsedData.totalEstimatedNutrition.proteinGrams}g</span>
                <span>•</span>
                <span>Carbs: {parsedData.totalEstimatedNutrition.carbsGrams}g</span>
                <span>•</span>
                <span>Fats: {parsedData.totalEstimatedNutrition.fatsGrams}g</span>
              </div>
            </div>

            {/* Required CONFIRM / EDIT Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setStep('input')}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                EDIT
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isSaving || parsedData.understoodItems.length === 0}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'CONFIRM'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
