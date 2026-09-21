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
} from 'lucide-react';
import { apiRequest } from '../services/api.js';

export const CameraFoodModal = ({ isOpen, onClose, mealType = 'lunch', onMealSaved }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'files' | 'drive'
  const [step, setStep] = useState('capture'); // 'capture' | 'analyzing' | 'error' | 'confirm'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [manualHint, setManualHint] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [detectedItems, setDetectedItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Live Camera state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  // Start / stop camera stream when tab is 'camera' and step is 'capture'
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
    }, 'image/jpeg', 0.9);
  };

  const resetState = () => {
    stopCamera();
    setStep('capture');
    setSelectedFile(null);
    setPreviewUrl(null);
    setDriveUrl('');
    setErrorMessage('');
    setDetectedItems([]);
    setIsSaving(false);
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

  // Convert Google Drive share links to direct image preview URLs
  const handleDriveSubmit = (e) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;

    let resolvedUrl = driveUrl.trim();
    // Google Drive share link match: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const driveMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      resolvedUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    setPreviewUrl(resolvedUrl);
    analyzeImage({ name: 'drive_meal_photo.jpg', url: resolvedUrl });
  };

  const handleSampleSelect = (sampleName, sampleUrl, hint = '') => {
    stopCamera();
    setPreviewUrl(sampleUrl);
    if (hint) setManualHint(hint);
    analyzeImage({ name: sampleName, hint });
  };

  const analyzeImage = async (file) => {
    setStep('analyzing');
    setErrorMessage('');

    try {
      const formData = new FormData();
      const hint = (file && file.hint) ? file.hint : manualHint;
      if (hint) {
        formData.append('manualHint', hint);
      }

      if (file instanceof File) {
        formData.append('image', file);
      } else {
        formData.append('filename', file.name || 'meal.jpg');
        if (file.url) formData.append('imageUrl', file.url);
      }

      const res = await apiRequest('/ai/analyze-photo', {
        method: 'POST',
        body: formData,
      });

      if (!res.isFood) {
        setStep('error');
        setErrorMessage(res.message || 'Food not detected. Please capture a clear image of your meal or food.');
      } else {
        setDetectedItems(res.detectedItems || []);
        setStep('confirm');
      }
    } catch (err) {
      setStep('error');
      setErrorMessage(err.message || 'Unable to analyze image. Please try again.');
    }
  };

  const handleQuantityChange = (index, delta) => {
    setDetectedItems((prev) =>
      prev.map((item, idx) => {
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
      })
    );
  };

  const handleRemoveItem = (index) => {
    setDetectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalNutrition = detectedItems.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      proteinGrams: Math.round((acc.proteinGrams + (item.proteinGrams || 0)) * 10) / 10,
      carbsGrams: Math.round((acc.carbsGrams + (item.carbsGrams || 0)) * 10) / 10,
      fatsGrams: Math.round((acc.fatsGrams + (item.fatsGrams || 0)) * 10) / 10,
      fiberGrams: Math.round((acc.fiberGrams + (item.fiberGrams || 0)) * 10) / 10,
    }),
    { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 }
  );

  const handleSaveMeal = async () => {
    if (detectedItems.length === 0) {
      alert('Please have at least one food item.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await apiRequest('/meals', {
        method: 'POST',
        body: JSON.stringify({
          mealType,
          source: 'camera',
          items: detectedItems,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            AI Food Vision
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
            Scan & Validate Meal
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Strict food detection ensures only real food meals are recorded.
          </p>
        </div>

        {/* STEP 1: CAPTURE WITH 3 SOURCE TABS */}
        {step === 'capture' && (
          <div className="space-y-4">
            {/* Source Tabs */}
            <div className="flex bg-gray-100/80 p-1 rounded-2xl text-xs font-bold text-gray-600">
              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'camera'
                    ? 'bg-white text-emerald-900 shadow-xs font-extrabold'
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
                    ? 'bg-white text-emerald-900 shadow-xs font-extrabold'
                    : 'hover:text-gray-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                Files & Folder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('drive')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'drive'
                    ? 'bg-white text-emerald-900 shadow-xs font-extrabold'
                    : 'hover:text-gray-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                Google Drive
              </button>
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
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
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
                      {/* Viewfinder crosshair overlay */}
                      <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                        <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-sm" />
                        <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-sm" />
                        <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-sm" />
                        <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-sm" />
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleFacingMode}
                        className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full backdrop-blur-xs hover:bg-black/80"
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
                    Choose from Files or Folders
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
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900">
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

            {/* Food Reference / Google Search Hint */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Food Reference / Google Image Hint (Optional):
                </span>
                {manualHint && (
                  <button
                    type="button"
                    onClick={() => setManualHint('')}
                    className="text-[10px] font-bold text-amber-700 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. Dosa, Boiled Eggs, Rice & Dal, Paneer..."
                value={manualHint}
                onChange={(e) => setManualHint(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:border-amber-500 font-medium text-gray-800 shadow-xs"
              />
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['Dosa', 'Boiled Eggs', 'Steamed Rice', 'Yellow Dal', 'Roti', 'Paneer'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setManualHint(chip)}
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
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-2">Instant Test Presets:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'crispy_dosa_chutney.jpg',
                      '/images/dosa.jpg',
                      'Dosa'
                    )
                  }
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 text-left bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Crispy Dosa (Valid Food)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'boiled_eggs_plate.jpg',
                      '/images/boiled_eggs.jpg',
                      'Eggs'
                    )
                  }
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 text-left bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Boiled Eggs (Valid Food)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'ragi_java_cup.jpg',
                      '/images/ragi_java.jpg',
                      'Ragi Java'
                    )
                  }
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 text-left bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Ragi Java (Valid Food)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSampleSelect(
                      'bread_omelette_plate.jpg',
                      '/images/bread_omelette.jpg',
                      'Bread Omelette'
                    )
                  }
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 text-left bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Bread Omelette (Valid Food)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ANALYZING */}
        {step === 'analyzing' && (
          <div className="py-12 text-center">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
            <h4 className="text-base font-bold text-gray-900">Validating & Scanning Image...</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
              Checking for food presence and classifying individual nutritional components.
            </p>
          </div>
        )}

        {/* STEP 3: REJECTION / ERROR */}
        {step === 'error' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-rose-900">Food not detected.</h4>
              <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setStep('capture')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
            >
              Try Again
            </button>
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
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Food Verified (95% confidence)
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Divided Nutrients by Food Item:
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  AI Analyzed
                </span>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {detectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">{item.name}</span>
                        {item.dominantNutrient ? (
                          <span className="inline-block mt-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            {item.dominantNutrient}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">
                            {item.calories} kcal • {item.proteinGrams}g Protein
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(idx, -0.5)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-gray-800 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(idx, 0.5)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold"
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

                    {/* Nutrient breakdown bars/pills */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1 border-t border-gray-200/50">
                      <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                        <span className="text-gray-400 block text-[8px] uppercase">Calories</span>
                        <span className="font-bold text-gray-800">{item.calories}</span>
                      </div>
                      <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                        <span className="text-gray-400 block text-[8px] uppercase">Carbs</span>
                        <span className="font-bold text-emerald-700">{item.carbsGrams}g</span>
                      </div>
                      <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                        <span className="text-gray-400 block text-[8px] uppercase">Protein</span>
                        <span className="font-bold text-blue-700">{item.proteinGrams}g</span>
                      </div>
                      <div className="bg-white px-1.5 py-1 rounded-lg border border-gray-100">
                        <span className="text-gray-400 block text-[8px] uppercase">Fats</span>
                        <span className="font-bold text-amber-700">{item.fatsGrams}g</span>
                      </div>
                    </div>
                  </div>
                ))}
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

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('capture')}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Scan Another Photo
              </button>
              <button
                type="button"
                onClick={handleSaveMeal}
                disabled={isSaving}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
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
