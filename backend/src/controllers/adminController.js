import { Product, Order, Subscription, User } from '../models/index.js';

export const getAdminStats = async (req, res) => {
  try {
    const [userCount, productCount, orderCount, subCount, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Subscription.countDocuments(),
      Order.find({}),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        activeSubscriptions: subCount,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, nutrition, ingredients, image, tags } = req.body;

    if (!name || !category || !description || !price || !image) {
      return res.status(400).json({ success: false, message: 'Name, category, description, price, and image are required.' });
    }

    const product = await Product.create({
      name,
      category,
      description,
      price: Number(price),
      stock: Number(stock) || 50,
      nutrition: nutrition || { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 },
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      image,
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product,
    });
  } catch (error) {
    console.error('addProduct error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Product removed from store.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}, { createdAt: -1 });
    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!['Placed', 'Processing', 'Out for Delivery', 'Delivered'].includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({}, { createdAt: -1 });
    return res.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve subscriptions.' });
  }
};
