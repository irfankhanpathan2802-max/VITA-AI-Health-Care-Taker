import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
  getOrders,
  getSubscriptions,
  createSubscription,
  updateSubscriptionStatus,
} from '../controllers/storeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public or auth product browsing
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Protected cart, orders, subscriptions
router.use(authMiddleware);

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart', updateCartItem);
router.delete('/cart/:productId', removeFromCart);

router.post('/checkout', checkout);
router.get('/orders', getOrders);

router.get('/subscriptions', getSubscriptions);
router.post('/subscriptions', createSubscription);
router.put('/subscriptions/:id/status', updateSubscriptionStatus);

export default router;
