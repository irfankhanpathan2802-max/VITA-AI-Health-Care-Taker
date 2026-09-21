import { Router } from 'express';
import { getLifestyleInsights, logWater, getTodayWater } from '../controllers/lifestyleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/insights', getLifestyleInsights);
router.post('/water', logWater);
router.get('/water', getTodayWater);

export default router;
