import { Product, Cart, Order, Subscription } from '../models/index.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, tag } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter);
    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve store products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving product.' });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = { userId, items: [] };
    }

    const totalAmount = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    return res.json({
      success: true,
      cart,
      totalAmount,
      totalItems,
    });
  } catch (error) {
    console.error('getCart error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve cart.' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{
          productId: product._id,
          productName: product.name,
          productImage: product.image,
          price: product.price,
          proteinGrams: product.nutrition?.proteinGrams || 0,
          calories: product.nutrition?.calories || 0,
          quantity: Number(quantity),
        }],
      });
    } else {
      const existingIdx = cart.items.findIndex(i => i.productId?.toString() === productId?.toString());
      if (existingIdx > -1) {
        cart.items[existingIdx].quantity += Number(quantity);
      } else {
        cart.items.push({
          productId: product._id,
          productName: product.name,
          productImage: product.image,
          price: product.price,
          proteinGrams: product.nutrition?.proteinGrams || 0,
          calories: product.nutrition?.calories || 0,
          quantity: Number(quantity),
        });
      }
      cart = await Cart.findOneAndUpdate({ userId }, { items: cart.items }, { new: true });
    }

    const totalAmount = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    return res.json({
      success: true,
      message: `${product.name} added to cart.`,
      cart,
      totalAmount,
      totalItems,
    });
  } catch (error) {
    console.error('addToCart error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart is empty.' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId?.toString() !== productId?.toString());
    } else {
      const item = cart.items.find(i => i.productId?.toString() === productId?.toString());
      if (item) item.quantity = Number(quantity);
    }

    cart = await Cart.findOneAndUpdate({ userId }, { items: cart.items }, { new: true });
    const totalAmount = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    return res.json({
      success: true,
      cart,
      totalAmount,
      totalItems,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update cart.' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(i => i.productId?.toString() !== productId?.toString());
    cart = await Cart.findOneAndUpdate({ userId }, { items: cart.items }, { new: true });

    const totalAmount = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    return res.json({
      success: true,
      message: 'Item removed from cart.',
      cart,
      totalAmount,
      totalItems,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to remove cart item.' });
  }
};

export const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required.' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    const totalAmount = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    // Calculate delivery estimate: 2-3 business days
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 2);
    const deliveryEstimate = estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount,
      shippingAddress,
      paymentStatus: 'Paid (Simulated)',
      orderStatus: 'Placed',
      deliveryEstimate,
    });

    // Clear user cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! VitaCare healthy food delivery has been scheduled.',
      order,
    });
  } catch (error) {
    console.error('checkout error:', error);
    return res.status(500).json({ success: false, message: 'Checkout failed. Please try again.' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }, { createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve order history.' });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const userId = req.user._id;
    const subscriptions = await Subscription.find({ userId }, { createdAt: -1 });

    return res.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve subscriptions.' });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planType, frequency = 'Monthly', deliveryAddress = '', dietPreference = 'Vegetarian' } = req.body;

    const prices = {
      'High Protein Plan': 3499,
      'Healthy Breakfast Plan': 2199,
      'Balanced Nutrition Plan': 2999,
      'Customized Wellness Plan': 3999,
    };

    const includedItemsMap = {
      'High Protein Plan': ['Clean Meal Boxes (10x)', 'Organic Malai Paneer (2x)', 'Sprouted Moong & Chickpea Mix (4x)', 'Free-Range Eggs / Tofu Pack (2x)'],
      'Healthy Breakfast Plan': ['Instant Ragi Java Wellness Mix (2x)', 'Heritage Sprouted Ragi Flour (2x)', 'Rolled Oats & Ancient Grains (2x)', 'Super 5 Seed Mix (1x)'],
      'Balanced Nutrition Plan': ['Clean Meal Boxes (6x)', 'Seasonal Antioxidant Fruit Box (2x)', 'Organic Sprouted Legumes (2x)', 'Raw Almonds & Walnuts (1x)'],
      'Customized Wellness Plan': ['Custom Protein Boxes (8x)', 'Sprouted Millets & Ragi Mix (2x)', 'Seasonal Fresh Fruit Box (2x)', 'Fox Nuts & Healthy Snacks (4x)'],
    };

    const price = prices[planType] || 2999;
    const includedItems = includedItemsMap[planType] || ['Balanced Healthy Meals'];

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 3);
    const nextDeliveryDate = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const subscription = await Subscription.create({
      userId,
      planType,
      frequency,
      price,
      status: 'Active',
      nextDeliveryDate,
      deliveryAddress,
      dietPreference,
      includedItems,
    });

    return res.status(201).json({
      success: true,
      message: `${planType} subscription created successfully!`,
      subscription,
    });
  } catch (error) {
    console.error('createSubscription error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create subscription.' });
  }
};

export const updateSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Paused', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const sub = await Subscription.findById(id);
    if (!sub || sub.userId.toString() !== userId.toString()) {
      return res.status(404).json({ success: false, message: 'Subscription not found.' });
    }

    const updated = await Subscription.findByIdAndUpdate(id, { status }, { new: true });

    return res.json({
      success: true,
      message: `Subscription has been ${status.toLowerCase()}.`,
      subscription: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update subscription.' });
  }
};
