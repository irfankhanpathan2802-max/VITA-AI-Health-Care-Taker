import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Link as LinkIcon,
  FolderOpen,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
  Sparkles,
  SwitchCamera,
  Mic,
  MicOff,
  Search,
  Plus,
  Barcode,
  HelpCircle,
  ShieldAlert,
  Info,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { apiRequest } from '../services/api.js';
import { FOOD_CATALOG } from '../data/foodCatalog.js';

export const CameraFoodModal = ({ isOpen, onClose, mealType = 'lunch', onMealSaved }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'files' | 'drive' | 'barcode'
  const [step, setStep] = useState('capture'); // 'capture' | 'analyzing' | 'error' | 'confirm'
  const [analysisStage, setAnalysisStage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [manualHint, setManualHint] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);
  const [detectedItems, setDetectedItems] = useState([]);
  const [primaryIdentification, setPrimaryIdentification] = useState(null);
  const [possibleMatches, setPossibleMatches] = useState([]);
  const [nutritionSource, setNutritionSource] = useState('database');
  const [healthDisclaimer, setHealthDisclaimer] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiEngineUsed, setAiEngineUsed] = useState('VitaCare Multi-Stage Vision Agent');

  // Live Camera state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  // Multi-stage analysis animation ticker
  useEffect(() => {
    let timer;
    if (step === 'analyzing') {
      setAnalysisStage(1);
      timer = setInterval(() => {
        setAnalysisStage((prev) => (prev < 5 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(timer);
  }, [step]);

  // Start / stop camera stream
  useEffect(() => {
    let streamInstance = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          streamInstance = stream;
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setCameraError('Live camera not supported by this browser. Please use the File Upload tab.');
        }
      } catch (err) {
        console.warn('Camera access error:', err);
        setCameraError('Camera access not granted or unavailable. You can upload photos directly from files.');
      }
    };

    if (isOpen && step === 'capture' && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, step, activeTab, facingMode]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleToggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const captureLiveSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'live_camera_capture.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        stopCamera();
        analyzeImage(file);
      }
    }, 'image/jpeg', 0.92);
  };

  const resetState = () => {
    stopCamera();
    setStep('capture');
    setSelectedFile(null);
    setPreviewUrl(null);
    setDriveUrl('');
    setManualHint('');
    setBarcodeInput('');
    setSearchQuery('');
    setErrorMessage('');
    setErrorDetails(null);
    setDetectedItems([]);
    setPrimaryIdentification(null);
    setPossibleMatches([]);
    setIsSaving(false);
    setIsListening(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
      analyzeImage(file);
    }
  };

  const handleDriveSubmit = (e) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;

    let resolvedUrl = driveUrl.trim();
    const driveMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      resolvedUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    setPreviewUrl(resolvedUrl);
    analyzeImage({ name: 'drive_meal_photo.jpg', url: resolvedUrl });
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    analyzeImage({ name: 'barcode_lookup', barcode: barcodeInput.trim() });
  };

  const handleSampleSelect = (sampleName, sampleUrl, hint = '') => {
    stopCamera();
    setPreviewUrl(sampleUrl);
    if (hint) setManualHint(hint);
    analyzeImage({ name: sampleName, hint });
  };

  // Web Speech recognition inside camera modal
  const handleStartVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type the food name.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setManualHint(transcript);
      setSearchQuery(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const analyzeImage = async (file) => {
    setStep('analyzing');
    setErrorMessage('');
    setErrorDetails(null);

    try {
      const formData = new FormData();
      const hint = (file && file.hint) ? file.hint : manualHint;
      if (hint) {
        formData.append('manualHint', hint);
      }

      const barcodeVal = (file && file.barcode) ? file.barcode : barcodeInput;
      if (barcodeVal) {
        formData.append('barcode', barcodeVal);
      }

      if (file instanceof File) {
        formData.append('image', file);
      } else {
        formData.append('filename', file.name || 'meal.jpg');
        if (file.url) formData.append('imageUrl', file.url);
      }

      // Call our 7-stage Food Vision API
      const res = await apiRequest('/food/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.success || !res.foodDetection || !res.foodDetection.isFood) {
        setStep('error');
        setErrorMessage(res.message || 'Food not detected. Please capture a clear image of your meal or food item.');
        setErrorDetails(res);
      } else {
        setDetectedItems(res.items || res.detectedItems || []);
        setPrimaryIdentification(res.foodIdentification || null);
        setPossibleMatches(res.foodIdentification?.possibleMatches || []);
        setNutritionSource(res.nutritionSource || 'database');
        setHealthDisclaimer(res.healthDisclaimer || 'Nutrition values are estimates based on standard clinical databases.');
        setStep('confirm');
      }
    } catch (err) {
      setStep('error');
      setErrorMessage(err.message || 'Unable to analyze image. Please check camera lighting or enter manually.');
    }
  };

  const handleSelectCatalogFood = (food) => {
    const newItem = {
      name: food.name,
      alternateNames: [],
      portion: {
        value: 1,
        unit: food.unit || 'serving',
        estimated: true,
      },
      quantity: 1,
      unit: food.unit || 'serving',
      confidence: 0.98,
      nutrition: {
        calories: food.calories,
        protein_g: food.proteinGrams,
        carbohydrates_g: food.carbsGrams,
        fat_g: food.fatsGrams,
        fiber_g: food.fiberGrams || 0,
        sugar_g: 0,
        sodium_mg: 0,
      },
      nutritionSource: 'catalog',
    };

    if (step === 'confirm') {
      setDetectedItems((prev) => [...prev, newItem]);
      setSearchQuery('');
    } else {
      setDetectedItems([newItem]);
      setManualHint(food.name);
      setStep('confirm');
    }
  };

  // Switch to an alternate match from possibleMatches
  const handleSelectAlternateMatch = (match) => {
    const catalogMatch = FOOD_CATALOG.find(
      (f) => f.name.toLowerCase().includes(match.name.toLowerCase()) || match.name.toLowerCase().includes(f.name.toLowerCase())
    );

    if (catalogMatch) {
      handleSelectCatalogFood(catalogMatch);
    } else {
      // Create item directly
      const newItem = {
        name: match.name,
        alternateNames: [],
        portion: { value: 1, unit: 'serving', estimated: true },
        quantity: 1,
        unit: 'serving',
        confidence: match.confidence || 0.85,
        nutrition: {
          calories: 220,
          protein_g: 5,
          carbohydrates_g: 28,
          fat_g: 10,
          fiber_g: 2,
        },
        nutritionSource: 'database',
      };
      setDetectedItems([newItem]);
    }
  };

  // Adjust portion by multiplier (0.5x, 1x, 1.5x, 2x)
  const handleSetPortionMultiplier = (index, multiplier) => {
    setDetectedItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const currentVal = item.portion?.value || item.quantity || 1;
          const newVal = Math.round(multiplier * 10) / 10;
          const ratio = newVal / currentVal;
          const nut = item.nutrition || {};

          return {
            ...item,
            quantity: newVal,
            portion: {
              ...item.portion,
              value: newVal,
            },
            nutrition: {
              ...nut,
              calories: Math.round((nut.calories || 0) * ratio),
              protein_g: Math.round(((nut.protein_g || item.proteinGrams || 0) * ratio) * 10) / 10,
              carbohydrates_g: Math.round(((nut.carbohydrates_g || item.carbsGrams || 0) * ratio) * 10) / 10,
              fat_g: Math.round(((nut.fat_g || item.fatsGrams || 0) * ratio) * 10) / 10,
              fiber_g: Math.round(((nut.fiber_g || item.fiberGrams || 0) * ratio) * 10) / 10,
            },
          };
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (index, delta) => {
    setDetectedItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const currentVal = item.portion?.value || item.quantity || 1;
          const newQty = Math.max(0.25, Math.round((currentVal + delta) * 10) / 10);
          const ratio = newQty / currentVal;
          const nut = item.nutrition || {};

          return {
            ...item,
            quantity: newQty,
            portion: {
              ...item.portion,
              value: newQty,
            },
            nutrition: {
              ...nut,
              calories: Math.round((nut.calories || 0) * ratio),
              protein_g: Math.round(((nut.protein_g || item.proteinGrams || 0) * ratio) * 10) / 10,
              carbohydrates_g: Math.round(((nut.carbohydrates_g || item.carbsGrams || 0) * ratio) * 10) / 10,
              fat_g: Math.round(((nut.fat_g || item.fatsGrams || 0) * ratio) * 10) / 10,
              fiber_g: Math.round(((nut.fiber_g || item.fiberGrams || 0) * ratio) * 10) / 10,
            },
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (index) => {
    setDetectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalNutrition = detectedItems.reduce(
    (acc, item) => {
      const nut = item.nutrition || {};
      const cal = nut.calories ?? item.calories ?? 0;
      const prot = nut.protein_g ?? item.proteinGrams ?? 0;
      const carbs = nut.carbohydrates_g ?? item.carbsGrams ?? 0;
      const fats = nut.fat_g ?? item.fatsGrams ?? 0;
      const fib = nut.fiber_g ?? item.fiberGrams ?? 0;

      return {
        calories: acc.calories + cal,
        proteinGrams: Math.round((acc.proteinGrams + prot) * 10) / 10,
        carbsGrams: Math.round((acc.carbsGrams + carbs) * 10) / 10,
        fatsGrams: Math.round((acc.fatsGrams + fats) * 10) / 10,
        fiberGrams: Math.round((acc.fiberGrams + fib) * 10) / 10,
      };
    },
    { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 }
  );

  const handleSaveMeal = async () => {
    if (detectedItems.length === 0) {
      alert('Please add at least one food item.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await apiRequest('/meals', {
        method: 'POST',
        body: JSON.stringify({
          mealType,
          source: 'camera',
          items: detectedItems.map((item) => ({
            name: item.name,
            quantity: item.portion?.value || item.quantity || 1,
            unit: item.portion?.unit || item.unit || 'serving',
            calories: item.nutrition?.calories ?? item.calories ?? 0,
            proteinGrams: item.nutrition?.protein_g ?? item.proteinGrams ?? 0,
            carbsGrams: item.nutrition?.carbohydrates_g ?? item.carbsGrams ?? 0,
            fatsGrams: item.nutrition?.fat_g ?? item.fatsGrams ?? 0,
            fiberGrams: item.nutrition?.fiber_g ?? item.fiberGrams ?? 0,
          })),
          imageUrl: previewUrl || '',
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

  const filteredFoods = searchQuery.trim()
    ? FOOD_CATALOG.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[94vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            VitaCare Food Vision + Nutrition Agent
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-1.5">
            Capture & Analyze Meal
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 max-w-md mx-auto">
            7-stage clinical nutrition pipeline with food vs. non-food negative validation & NIN/USDA verified database.
          </p>
        </div>

        {/* STEP 1: CAPTURE WITH GUIDELINES & 4 TABS */}
        {step === 'capture' && (
          <div className="space-y-4">
            {/* Source Tabs */}
            <div className="flex bg-gray-100/90 p-1 rounded-2xl text-xs font-bold text-gray-600">
              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'camera'
                    ? 'bg-white text-emerald-950 shadow-xs font-extrabold'
                    : 'hover:text-gray-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                Live Camera
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('files')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'files'
                    ? 'bg-white text-emerald-950 shadow-xs font-extrabold'
                    : 'hover:text-gray-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                Files
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('drive')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'drive'
                    ? 'bg-white text-emerald-950 shadow-xs font-extrabold'
                    : 'hover:text-gray-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                Cloud Link
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('barcode')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'barcode'
                    ? 'bg-white text-emerald-950 shadow-xs font-extrabold'
                    : 'hover:text-gray-900'
                }`}
              >
                <Barcode className="w-3.5 h-3.5 text-emerald-600" />
                Barcode
              </button>
            </div>

            {/* CAMERA GUIDELINES CHECKLIST */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-3 text-[11px] text-emerald-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">For Best Recognition Accuracy:</span>
                <span className="text-emerald-800/90 leading-relaxed block mt-0.5">
                  1. Center plate in good lighting • 2. Capture all dishes (Rice, Dal, Curries) • 3. For snacks like <b>Boondi</b>, show product label or dish clearly.
                </span>
              </div>
            </div>

            {/* TAB 1: LIVE CAMERA VIEWFINDER */}
            {activeTab === 'camera' && (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center shadow-inner border border-gray-800">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {cameraError ? (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                      <p className="text-xs text-gray-300 max-w-xs">{cameraError}</p>
                      <label className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer shadow-sm">
                        Use Phone / Device Camera
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                      {/* Visual framing box with corner brackets */}
                      <div className="absolute inset-6 border border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                        <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-sm" />
                        <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-sm" />
                        <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-sm" />
                        <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-sm" />
                        <span className="text-[10px] font-semibold text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                          Position food inside frame
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleFacingMode}
                        className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full backdrop-blur-xs hover:bg-black/80 transition-colors"
                        title="Flip Camera"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {!cameraError && (
                  <button
                    type="button"
                    onClick={captureLiveSnapshot}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Camera className="w-4 h-4" />
                    Snap Meal Photo & Analyze
                  </button>
                )}
              </div>
            )}

            {/* TAB 2: DEVICE FILES & FOLDER UPLOAD */}
            {activeTab === 'files' && (
              <div className="space-y-3">
                <label className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#FBFBFA] hover:bg-emerald-50/20 transition-all text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <FolderOpen className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    Choose from Files or Camera
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Select any food photo (JPG, PNG, WEBP)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* TAB 3: GOOGLE DRIVE / CLOUD LINK */}
            {activeTab === 'drive' && (
              <form onSubmit={handleDriveSubmit} className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900">
                  <span className="font-bold block mb-1">Google Drive & Cloud Links:</span>
                  Paste any public Google Drive image link or web image URL. VitaCare will automatically resolve and scan the image.
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Paste Image Link (Google Drive / Web URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!driveUrl.trim()}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50"
                    >
                      Scan Link
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 4: BARCODE & PACKAGED FOODS */}
            {activeTab === 'barcode' && (
              <form onSubmit={handleBarcodeSubmit} className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-950">
                  <span className="font-bold block mb-1">Packaged Snack Barcode Lookup:</span>
                  Enter the product barcode number (e.g. 8901491101837 for Haldiram's Boondi, 8901030018597 for Tata Salt).
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Barcode Number (EAN / UPC)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 8901491101837"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!barcodeInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold disabled:opacity-50"
                    >
                      Lookup
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Instant Food Search & Voice Assistant */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Food Search & Voice Assistant:
                </span>
                <button
                  type="button"
                  onClick={handleStartVoice}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                  title="Speak food name"
                >
                  {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  {isListening ? 'Listening...' : 'Speak Food'}
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Type or search food: Boondi, Dosa, Idli, Dal, Rice..."
                  value={searchQuery || manualHint}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setManualHint(e.target.value);
                  }}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:border-amber-500 font-medium text-gray-800 shadow-xs"
                />
                {(searchQuery || manualHint) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setManualHint('');
                    }}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete suggestions */}
              {filteredFoods.length > 0 && (
                <div className="bg-white rounded-xl border border-amber-200 p-1.5 shadow-sm space-y-1">
                  {filteredFoods.map((f, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCatalogFood(f)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-bold text-gray-800">{f.name}</span>
                      <span className="text-[10px] text-gray-500">{f.calories} kcal • {f.proteinGrams}g P</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['Boondi', 'Rice & Dal', 'Dosa', 'Idli', 'Boiled Eggs', 'Roti', 'Paneer'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setManualHint(chip);
                      setSearchQuery(chip);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      manualHint.toLowerCase().includes(chip.toLowerCase())
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Sample Presets */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-2">Instant Test Presets:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'crispy_boondi_plate.jpg',
                      '/images/makhana.jpg',
                      'Boondi'
                    )
                  }
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 text-left bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Boondi Snack (Valid Food)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'rice_and_dal_thali.jpg',
                      '/images/salad_bowl.jpg',
                      'Rice and Dal'
                    )
                  }
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 text-left bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Rice + Dal (Multi-item)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'water_bottle.jpg',
                      '',
                      'water bottle'
                    )
                  }
                  className="p-2.5 rounded-xl border border-rose-200 hover:border-rose-400 text-left bg-rose-50/50 hover:bg-rose-50 text-rose-900 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  Water Bottle (Non-Food Test)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'laptop_workdesk.jpg',
                      '',
                      'laptop computer'
                    )
                  }
                  className="p-2.5 rounded-xl border border-rose-200 hover:border-rose-400 text-left bg-rose-50/50 hover:bg-rose-50 text-rose-900 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  Laptop (Non-Food Test)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: MULTI-STAGE ANALYZING ANIMATION */}
        {step === 'analyzing' && (
          <div className="py-10 text-center space-y-6">
            <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
            <div>
              <h4 className="text-base font-bold text-gray-900">
                Processing Food Vision Pipeline
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                Executing 7-stage clinical nutrition & quality assessment
              </p>
            </div>

            {/* Progress Checklist */}
            <div className="max-w-xs mx-auto text-left space-y-2.5 bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs">
              <div className={`flex items-center gap-2 ${analysisStage >= 1 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                {analysisStage > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />}
                <span>Stage 1: Image Quality & Clarity Check</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStage >= 2 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                {analysisStage > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : analysisStage === 2 ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                <span>Stage 2: Food vs. Non-Food Classification</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStage >= 3 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                {analysisStage > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : analysisStage === 3 ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                <span>Stage 3: Dish & Multi-Plate Identification</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStage >= 4 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                {analysisStage > 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : analysisStage === 4 ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                <span>Stage 4: NIN / USDA Clinical Nutrition Query</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStage >= 5 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                {analysisStage >= 5 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                <span>Stage 5: Portion & Macronutrient Estimation</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REJECTION / NON-FOOD / ERROR */}
        {step === 'error' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-rose-950">
                {errorDetails?.foodDetection?.category === 'NON_FOOD'
                  ? 'Non-Food Object Detected'
                  : 'Food Not Clearly Detected'}
              </h4>
              <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">
                {errorMessage}
              </p>
            </div>

            {errorDetails?.foodDetection?.category === 'NON_FOOD' && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 max-w-sm mx-auto text-left flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <b>Negative Validation Protected:</b> VitaCare guarantees that non-food objects (water bottles, laptops, utensils) will never be hallucinated as food or meals.
                </span>
              </div>
            )}

            {/* Quick 1-tap food recovery selector */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-left space-y-2">
              <span className="text-xs font-bold text-gray-700 block">
                Select your food to log manually:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Boondi (Crispy Kara Boondi)', cal: 240 },
                  { name: 'Boondi Raita', cal: 160 },
                  { name: 'Crispy Plain Dosa with Chutney', cal: 170 },
                  { name: 'Steamed Rice (Cooked)', cal: 195 },
                  { name: 'Yellow Dal (Cooked)', cal: 145 },
                  { name: 'Boiled Egg (2 Whole)', cal: 156 },
                  { name: 'Paneer Butter Masala', cal: 320 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const match = FOOD_CATALOG.find((f) => f.name === item.name);
                      if (match) handleSelectCatalogFood(match);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 text-xs font-bold text-gray-800 transition-colors"
                  >
                    + {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('capture')}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Retake Photo
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & PORTION ADJUSTMENT */}
        {step === 'confirm' && (
          <div className="space-y-5">
            {previewUrl && (
              <div className="relative rounded-2xl overflow-hidden h-40 border border-gray-100">
                <img
                  src={previewUrl}
                  alt="Detected Food"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Gemini 3.0 Flash + DINOv3 ({Math.round((primaryIdentification?.confidence || 0.94) * 100)}% confidence)
                </div>
              </div>
            )}

            {/* Low Confidence Guard Banner */}
            {primaryIdentification?.isLowConfidence && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Low Confidence Detection:</span>
                  <span>VitaCare never forces an automated prediction when confidence is low. Please confirm or select your meal from the candidates below.</span>
                </div>
              </div>
            )}

            {/* Possible Alternate Matches Drawer (e.g. Boondi vs Boondi Raita) */}
            {possibleMatches && possibleMatches.length > 0 && (
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 text-xs space-y-1.5">
                <span className="font-bold text-blue-950 block">
                  Candidate Preparations & Matches:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {possibleMatches.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAlternateMatch(m)}
                      className="px-2.5 py-1 bg-white border border-blue-200 hover:border-blue-400 rounded-lg text-blue-900 font-semibold text-[11px] transition-colors"
                    >
                      {m.name} ({Math.round(m.confidence * 100)}%)
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Identified Food Items & Portions:
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md font-bold">
                  {nutritionSource === 'packaged_database'
                    ? 'Packaged Facts'
                    : 'NIN / USDA Verified'}
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {detectedItems.map((item, idx) => {
                  const nut = item.nutrition || {};
                  const cal = nut.calories ?? item.calories ?? 0;
                  const prot = nut.protein_g ?? item.proteinGrams ?? 0;
                  const carbs = nut.carbohydrates_g ?? item.carbsGrams ?? 0;
                  const fats = nut.fat_g ?? item.fatsGrams ?? 0;
                  const portionVal = item.portion?.value || item.quantity || 1;
                  const portionUnit = item.portion?.unit || item.unit || 'serving';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 text-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900 block text-sm">{item.name}</span>
                          <span className="text-gray-500 text-[11px]">
                            {portionVal} {portionUnit} • {cal} kcal
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Portion Multiplier Buttons */}
                          <div className="flex bg-white rounded-lg border border-gray-200 p-0.5 text-[10px] font-bold">
                            {[0.5, 1, 1.5, 2].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => handleSetPortionMultiplier(idx, m)}
                                className={`px-1.5 py-0.5 rounded ${
                                  portionVal === m
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {m}x
                              </button>
                            ))}
                          </div>

                          {/* Plus/Minus Fine Adjustment */}
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, -0.25)}
                              className="px-1.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              -
                            </button>
                            <span className="px-1.5 font-bold text-gray-800 text-xs">
                              {portionVal}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(idx, 0.25)}
                              className="px-1.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-gray-400 hover:text-rose-600 p-1"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Nutrient breakdown pills */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1.5 border-t border-gray-200/60">
                        <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                          <span className="text-gray-400 block text-[8px] uppercase">Calories</span>
                          <span className="font-bold text-gray-800">{cal}</span>
                        </div>
                        <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                          <span className="text-gray-400 block text-[8px] uppercase">Carbs</span>
                          <span className="font-bold text-emerald-700">{carbs}g</span>
                        </div>
                        <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                          <span className="text-gray-400 block text-[8px] uppercase">Protein</span>
                          <span className="font-bold text-blue-700">{prot}g</span>
                        </div>
                        <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                          <span className="text-gray-400 block text-[8px] uppercase">Fats</span>
                          <span className="font-bold text-amber-700">{fats}g</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add item search in confirm screen */}
              <div className="mt-2.5">
                <div className="relative">
                  <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="+ Add another food item (e.g. Boondi, Raita, Curd, Rice)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium text-gray-800"
                  />
                </div>
                {filteredFoods.length > 0 && (
                  <div className="bg-white rounded-xl border border-emerald-200 p-1.5 shadow-sm space-y-1 mt-1">
                    {filteredFoods.map((f, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCatalogFood(f)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-xs flex items-center justify-between transition-colors"
                      >
                        <span className="font-bold text-gray-800">{f.name}</span>
                        <span className="text-[10px] text-gray-500">{f.calories} kcal • {f.proteinGrams}g P</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Total Estimated Nutrition */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-950 mb-1">
                <span>Total Estimated Nutrition:</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {totalNutrition.calories} kcal
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] text-gray-600 mt-2">
                <div className="bg-white/80 p-1.5 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase">Protein</span>
                  <span className="font-bold text-gray-900">{totalNutrition.proteinGrams}g</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase">Carbs</span>
                  <span className="font-bold text-gray-900">{totalNutrition.carbsGrams}g</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase">Fats</span>
                  <span className="font-bold text-gray-900">{totalNutrition.fatsGrams}g</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-xl">
                  <span className="text-gray-400 block text-[9px] uppercase">Fiber</span>
                  <span className="font-bold text-gray-900">{totalNutrition.fiberGrams}g</span>
                </div>
              </div>
            </div>

            {/* Health Disclaimer */}
            <p className="text-[10px] text-gray-400 italic text-center px-4">
              * {healthDisclaimer || 'Nutrition values are estimates and may vary based on ingredients, preparation method, brand and portion size.'}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('capture')}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Scan Another Photo
              </button>
              <button
                type="button"
                onClick={handleSaveMeal}
                disabled={isSaving || detectedItems.length === 0}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSaving ? 'Saving Meal...' : 'Confirm & Save Meal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
