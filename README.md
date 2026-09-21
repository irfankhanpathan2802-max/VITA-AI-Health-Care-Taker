# 🌿 VitaCare — AI-Powered Preventive Healthcare & Nutrition Platform

> **Understand your lifestyle. Eat smarter. Build healthier habits.**

### 🌐 Live Prototype Links:
- 📱 **Live Web Application (Frontend)**: [https://vita-ai-health-care-taker.vercel.app/](https://vita-ai-health-care-taker.vercel.app/)
- ⚙️ **Live Backend API (Render)**: [https://vita-ai-health-care-taker.onrender.com/api/health](https://vita-ai-health-care-taker.onrender.com/api/health)

---

## 🚀 Key Features

### 1. 📸 AI Food Vision & Voice Logging
- **Instant Photo Recognition**: Point your camera or upload a photo to identify meal items and portion sizes with macro estimation (Calories, Protein, Carbs, Fats, Fiber).
- **Conversational Voice Logging**: Natural language speech-to-meal recognition (e.g., *"I had two eggs, two rotis, and dal for breakfast"*).
- **No Fabricated Data**: Always asks user confirmation before saving; strictly separates real meals from unlogged entries.

### 2. ⚡ Lifestyle & Circadian Intelligence
- **Deep Profile Analysis**: Cross-references sitting duration, screen time, exercise level, and sleep consistency.
- **Ergonomic & Circadian Prompts**: 20-20-20 screen strain breaks, circulation notices, and sleep recovery cues.

### 3. ⏰ Missed Meal Detection & Smart Compensation
- **Smart Reminders**: Detects skipped breakfasts or lunches based on your personalized routine.
- **Protein Recovery**: Suggests tomorrow's recovery plan and connects with the marketplace to bridge nutrient gaps.

### 4. 🛒 Curated VitaCare Store & Subscriptions
- **Verified Whole Foods**: Boiled eggs, authentic Ragi Java mixes, whole-wheat bread omelettes, gluten-free rolled oats, and sprouted legumes.
- **Flexible Subscriptions**: Daily, weekly, or monthly delivery plans tailored to your nutritional targets.

### 5. 📊 Reports & Insights
- **Weekly & Monthly Reports**: 4-week nutrient averages, macro compliance scores, and actionable recommendations.
- **AI Health Coach**: Interactive assistant for enquiries, nutrition advice, and platform assistance.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Lucide Icons, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose (Dual-mode: Auto-connects to local/Atlas MongoDB with resilient embedded storage fallback) |
| **AI Integration** | Google Gemini API (Multimodal Vision & Voice meal parsing) |

---

## 🏁 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/irfankhanpathan2802-max/VITA-AI-Health-Care-Taker.git
cd VITA-AI-Health-Care-Taker
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure backend/.env
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/vitacare
# JWT_SECRET=your_jwt_secret
# GEMINI_API_KEY=your_gemini_api_key
npm run dev
```
Backend runs at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Configure frontend/.env
# VITE_API_URL=http://localhost:5000/api
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🔒 Security & Privacy
- Zero hardcoded secrets: all API keys and credentials are kept in `.env` files protected by `.gitignore`.
- Password hashing with `bcryptjs` and stateless authentication with JWT tokens.

---

## 📄 License
This project is licensed under the MIT License.
