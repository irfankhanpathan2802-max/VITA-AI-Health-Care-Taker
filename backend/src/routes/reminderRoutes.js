import { Router } from 'express';
import { getReminders, updateReminder, getMissedMealAlerts, rolloverMissedProtein } from '../controllers/reminderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getReminders);
router.put('/:id', updateReminder);
router.get('/missed-meals', getMissedMealAlerts);
router.post('/rollover-missed', rolloverMissedProtein);

export default router;
