import { Router } from 'express';
import { getMealsByDate, addMeal, deleteMeal, searchFoodDatabase } from '../controllers/mealController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMealsByDate);
router.post('/', addMeal);
router.delete('/:id', deleteMeal);
router.get('/search', searchFoodDatabase);

export default router;
