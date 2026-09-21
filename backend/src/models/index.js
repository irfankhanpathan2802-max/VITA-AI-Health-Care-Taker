import mongoose from 'express';
import { Schema, model } from 'mongoose';
import { getModel } from '../config/storage.js';

// User Schema
const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isOnboarded: { type: Boolean, default: false },
  isDemoUser: { type: Boolean, default: false },
}, { timestamps: true });

// Profile Schema
const ProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  heightCm: { type: Number },
  weightKg: { type: Number },
  goals: [{ type: String }],
  healthConditions: [{ type: String }],
  medications: [{ type: String }],
}, { timestamps: true });

// Lifestyle Schema
const LifestyleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  workType: {
    type: String,
    enum: ['Student', 'Desk job', 'Teacher', 'Driver', 'Physically active worker', 'Homemaker', 'Other'],
    default: 'Desk job'
  },
  workActivity: {
    type: String,
    enum: ['Mostly sitting', 'Mostly standing', 'Mixed', 'Physically active'],
    default: 'Mostly sitting'
  },
  sittingDurationHours: { type: Number, default: 8 },
  standingDurationHours: { type: Number, default: 2 },
  screenTimeHours: { type: Number, default: 7 },
  exerciseLevel: {
    type: String,
    enum: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'],
    default: 'Sedentary'
  },
  dailySteps: { type: Number, default: 0 },
  sleepTime: { type: String, default: '23:00' },
  wakeUpTime: { type: String, default: '07:00' },
  sleepDurationHours: { type: Number, default: 8 },
  sleepConsistency: { type: String, enum: ['Very consistent', 'Mostly consistent', 'Irregular'], default: 'Mostly consistent' },
  mealRoutine: {
    breakfastTime: { type: String, default: '09:00' },
    lunchTime: { type: String, default: '13:30' },
    snackTime: { type: String, default: '17:00' },
    dinnerTime: { type: String, default: '20:30' },
  },
  dietPreference: {
    type: String,
    enum: ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Other'],
    default: 'Vegetarian'
  },
  foodPreferences: [{ type: String }],
  foodsDisliked: [{ type: String }],
  allergies: [{ type: String }],
}, { timestamps: true });

// Nutrition Target Schema (Personalized estimates, not medical prescriptions)
const NutritionTargetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  calories: { type: Number, default: 2000 },
  proteinGrams: { type: Number, default: 60 },
  carbsGrams: { type: Number, default: 250 },
  fatsGrams: { type: Number, default: 65 },
  fiberGrams: { type: Number, default: 30 },
  waterMl: { type: Number, default: 2500 },
  calciumMg: { type: Number, default: 1000 },
  ironMg: { type: Number, default: 18 },
  vitaminDMcg: { type: Number, default: 15 },
  vitaminCMg: { type: Number, default: 75 },
  disclaimer: {
    type: String,
    default: 'Targets are personalized wellness estimates based on your profile and not medical prescriptions.'
  },
}, { timestamps: true });

// Meal Schema
const MealSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
    required: true
  },
  timeLogged: { type: String, required: true },
  source: {
    type: String,
    enum: ['camera', 'voice', 'manual'],
    default: 'manual'
  },
  imageUrl: { type: String },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'serving' },
    calories: { type: Number, default: 0 },
    proteinGrams: { type: Number, default: 0 },
    carbsGrams: { type: Number, default: 0 },
    fatsGrams: { type: Number, default: 0 },
    fiberGrams: { type: Number, default: 0 },
    vitamins: { type: Map, of: Number },
    minerals: { type: Map, of: Number },
  }],
  totalNutrition: {
    calories: { type: Number, default: 0 },
    proteinGrams: { type: Number, default: 0 },
    carbsGrams: { type: Number, default: 0 },
    fatsGrams: { type: Number, default: 0 },
    fiberGrams: { type: Number, default: 0 },
  },
  notes: { type: String },
}, { timestamps: true });

// Water Log Schema
const WaterLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  amountMl: { type: Number, required: true },
  timeLogged: { type: String, required: true },
}, { timestamps: true });

// Reminder Schema
const ReminderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'snack', 'dinner', 'hydration', 'movement', 'screen', 'sleep'],
    required: true
  },
  title: { type: String, required: true },
  time: { type: String, required: true }, // HH:mm
  enabled: { type: Boolean, default: true },
  days: [{ type: String, default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
}, { timestamps: true });

// Product Schema (VitaCare Store)
const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['HIGH PROTEIN', 'HEALTHY BREAKFAST', 'FRUITS & FRESH FOODS', 'HEALTHY READY-TO-EAT'],
    required: true
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 50 },
  nutrition: {
    calories: { type: Number, default: 0 },
    proteinGrams: { type: Number, default: 0 },
    carbsGrams: { type: Number, default: 0 },
    fatsGrams: { type: Number, default: 0 },
    fiberGrams: { type: Number, default: 0 },
  },
  ingredients: [{ type: String }],
  image: { type: String, required: true },
  tags: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Cart Schema
const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    productName: { type: String },
    productImage: { type: String },
    proteinGrams: { type: Number },
    calories: { type: Number },
  }],
}, { timestamps: true });

// Order Schema
const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    proteinGrams: { type: Number },
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  paymentStatus: { type: String, default: 'Paid (Simulated)' },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Processing', 'Out for Delivery', 'Delivered'],
    default: 'Placed'
  },
  deliveryEstimate: { type: String },
}, { timestamps: true });

// Subscription Schema
const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planType: {
    type: String,
    enum: ['High Protein Plan', 'Healthy Breakfast Plan', 'Balanced Nutrition Plan', 'Customized Wellness Plan'],
    required: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    default: 'Monthly'
  },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Cancelled'],
    default: 'Active'
  },
  nextDeliveryDate: { type: String },
  deliveryAddress: { type: String },
  dietPreference: { type: String },
  includedItems: [{ type: String }],
}, { timestamps: true });

// AI Insights & Tomorrow Plan Schema
const AIInsightSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  type: {
    type: String,
    enum: ['afternoon_alert', 'end_of_day', 'tomorrow_plan', 'weekly_summary', 'lifestyle_advice'],
    required: true
  },
  content: { type: String, required: true },
  foodSuggestions: [{
    name: { type: String },
    reason: { type: String },
    calories: { type: Number },
    proteinGrams: { type: Number },
    image: { type: String },
    productId: { type: String },
  }],
}, { timestamps: true });

// Compile Mongoose models
const MongoUser = model('User', UserSchema);
const MongoProfile = model('Profile', ProfileSchema);
const MongoLifestyle = model('Lifestyle', LifestyleSchema);
const MongoNutritionTarget = model('NutritionTarget', NutritionTargetSchema);
const MongoMeal = model('Meal', MealSchema);
const MongoWaterLog = model('WaterLog', WaterLogSchema);
const MongoReminder = model('Reminder', ReminderSchema);
const MongoProduct = model('Product', ProductSchema);
const MongoCart = model('Cart', CartSchema);
const MongoOrder = model('Order', OrderSchema);
const MongoSubscription = model('Subscription', SubscriptionSchema);
const MongoAIInsight = model('AIInsight', AIInsightSchema);

// Export resilient model wrappers that seamlessly work in MongoDB or memoryStore
export const User = {
  find: (q, s) => getModel(MongoUser, 'users').find(q, s),
  findOne: (q) => getModel(MongoUser, 'users').findOne(q),
  findById: (id) => getModel(MongoUser, 'users').findById(id),
  create: (doc) => getModel(MongoUser, 'users').create(doc),
  findByIdAndUpdate: (id, u, o) => getModel(MongoUser, 'users').findByIdAndUpdate(id, u, o),
  findOneAndUpdate: (q, u, o) => getModel(MongoUser, 'users').findOneAndUpdate(q, u, o),
  findByIdAndDelete: (id) => getModel(MongoUser, 'users').findByIdAndDelete(id),
  countDocuments: (q) => getModel(MongoUser, 'users').countDocuments(q),
};

export const Profile = {
  find: (q) => getModel(MongoProfile, 'profiles').find(q),
  findOne: (q) => getModel(MongoProfile, 'profiles').findOne(q),
  findById: (id) => getModel(MongoProfile, 'profiles').findById(id),
  create: (doc) => getModel(MongoProfile, 'profiles').create(doc),
  findOneAndUpdate: (q, u, o) => getModel(MongoProfile, 'profiles').findOneAndUpdate(q, u, o),
  findByIdAndUpdate: (id, u, o) => getModel(MongoProfile, 'profiles').findByIdAndUpdate(id, u, o),
};

export const Lifestyle = {
  find: (q) => getModel(MongoLifestyle, 'lifestyles').find(q),
  findOne: (q) => getModel(MongoLifestyle, 'lifestyles').findOne(q),
  findById: (id) => getModel(MongoLifestyle, 'lifestyles').findById(id),
  create: (doc) => getModel(MongoLifestyle, 'lifestyles').create(doc),
  findOneAndUpdate: (q, u, o) => getModel(MongoLifestyle, 'lifestyles').findOneAndUpdate(q, u, o),
};

export const NutritionTarget = {
  find: (q) => getModel(MongoNutritionTarget, 'nutritionTargets').find(q),
  findOne: (q) => getModel(MongoNutritionTarget, 'nutritionTargets').findOne(q),
  create: (doc) => getModel(MongoNutritionTarget, 'nutritionTargets').create(doc),
  findOneAndUpdate: (q, u, o) => getModel(MongoNutritionTarget, 'nutritionTargets').findOneAndUpdate(q, u, o),
};

export const Meal = {
  find: (q, s) => getModel(MongoMeal, 'meals').find(q, s),
  findOne: (q) => getModel(MongoMeal, 'meals').findOne(q),
  findById: (id) => getModel(MongoMeal, 'meals').findById(id),
  create: (doc) => getModel(MongoMeal, 'meals').create(doc),
  findByIdAndDelete: (id) => getModel(MongoMeal, 'meals').findByIdAndDelete(id),
  deleteMany: (q) => getModel(MongoMeal, 'meals').deleteMany(q),
};

export const WaterLog = {
  find: (q) => getModel(MongoWaterLog, 'waterLogs').find(q),
  create: (doc) => getModel(MongoWaterLog, 'waterLogs').create(doc),
};

export const Reminder = {
  find: (q) => getModel(MongoReminder, 'reminders').find(q),
  findOne: (q) => getModel(MongoReminder, 'reminders').findOne(q),
  create: (doc) => getModel(MongoReminder, 'reminders').create(doc),
  insertMany: (docs) => getModel(MongoReminder, 'reminders').insertMany ? getModel(MongoReminder, 'reminders').insertMany(docs) : Promise.all(docs.map(d => getModel(MongoReminder, 'reminders').create(d))),
  findByIdAndUpdate: (id, u, o) => getModel(MongoReminder, 'reminders').findByIdAndUpdate(id, u, o),
  findOneAndUpdate: (q, u, o) => getModel(MongoReminder, 'reminders').findOneAndUpdate(q, u, o),
};

export const Product = {
  find: (q, s) => getModel(MongoProduct, 'products').find(q, s),
  findOne: (q) => getModel(MongoProduct, 'products').findOne(q),
  findById: (id) => getModel(MongoProduct, 'products').findById(id),
  create: (doc) => getModel(MongoProduct, 'products').create(doc),
  insertMany: (docs) => getModel(MongoProduct, 'products').insertMany ? getModel(MongoProduct, 'products').insertMany(docs) : Promise.all(docs.map(d => getModel(MongoProduct, 'products').create(d))),
  findByIdAndUpdate: (id, u, o) => getModel(MongoProduct, 'products').findByIdAndUpdate(id, u, o),
  findOneAndUpdate: (q, u, o) => getModel(MongoProduct, 'products').findOneAndUpdate(q, u, o),
  deleteMany: (q) => getModel(MongoProduct, 'products').deleteMany(q),
  findByIdAndDelete: (id) => getModel(MongoProduct, 'products').findByIdAndDelete(id),
  countDocuments: (q) => getModel(MongoProduct, 'products').countDocuments(q),
};

export const Cart = {
  findOne: (q) => getModel(MongoCart, 'carts').findOne(q),
  create: (doc) => getModel(MongoCart, 'carts').create(doc),
  findOneAndUpdate: (q, u, o) => getModel(MongoCart, 'carts').findOneAndUpdate(q, u, o),
  deleteOne: (q) => getModel(MongoCart, 'carts').deleteOne(q),
};

export const Order = {
  find: (q, s) => getModel(MongoOrder, 'orders').find(q, s),
  findById: (id) => getModel(MongoOrder, 'orders').findById(id),
  create: (doc) => getModel(MongoOrder, 'orders').create(doc),
  findByIdAndUpdate: (id, u, o) => getModel(MongoOrder, 'orders').findByIdAndUpdate(id, u, o),
  countDocuments: (q) => getModel(MongoOrder, 'orders').countDocuments(q),
};

export const Subscription = {
  find: (q) => getModel(MongoSubscription, 'subscriptions').find(q),
  findById: (id) => getModel(MongoSubscription, 'subscriptions').findById(id),
  create: (doc) => getModel(MongoSubscription, 'subscriptions').create(doc),
  findByIdAndUpdate: (id, u, o) => getModel(MongoSubscription, 'subscriptions').findByIdAndUpdate(id, u, o),
  countDocuments: (q) => getModel(MongoSubscription, 'subscriptions').countDocuments(q),
};

export const AIInsight = {
  find: (q, s) => getModel(MongoAIInsight, 'aiInsights').find(q, s),
  findOne: (q) => getModel(MongoAIInsight, 'aiInsights').findOne(q),
  create: (doc) => getModel(MongoAIInsight, 'aiInsights').create(doc),
  findOneAndUpdate: (q, u, o) => getModel(MongoAIInsight, 'aiInsights').findOneAndUpdate(q, u, o),
};
