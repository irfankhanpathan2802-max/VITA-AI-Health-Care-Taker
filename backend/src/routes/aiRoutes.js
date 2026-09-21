import { Router } from 'express';
import multer from 'multer';
import { analyzePhoto, parseVoice, chatWithCoach, getTomorrowsNutritionPlan, getAfternoonAlert, handleEnquiry } from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Open enquiry endpoint for platform questions & concierge
router.post('/enquiry', handleEnquiry);

router.use(authMiddleware);

router.post('/analyze-photo', upload.single('image'), analyzePhoto);
router.post('/parse-voice', parseVoice);
router.post('/coach', chatWithCoach);
router.get('/tomorrow-plan', getTomorrowsNutritionPlan);
router.get('/afternoon-alert', getAfternoonAlert);

export default router;
