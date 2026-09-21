import { Router } from 'express';
import { getProfile, completeOnboarding, updateProfile, updateLifestyle } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.post('/onboarding', completeOnboarding);
router.put('/profile', updateProfile);
router.put('/lifestyle', updateLifestyle);

export default router;
