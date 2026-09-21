import { Router } from 'express';
import {
  getAdminStats,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllSubscriptions,
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', getAdminStats);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/subscriptions', getAllSubscriptions);

export default router;
