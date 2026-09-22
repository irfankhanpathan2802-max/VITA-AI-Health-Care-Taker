import { Router } from 'express';
import multer from 'multer';
import {
  analyzeFoodImageController,
  barcodeLookupController,
  calculateNutritionController,
} from '../controllers/foodController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.use(authMiddleware);

// Analyze meal photo via 7-stage Food Vision & Nutrition pipeline
router.post('/analyze-image', upload.single('image'), analyzeFoodImageController);

// Packaged product barcode lookup (optional enhancement)
router.get('/barcode/:barcode', barcodeLookupController);

// Recalculate nutrition when user adjusts portions
router.post('/calculate-nutrition', calculateNutritionController);

export default router;
