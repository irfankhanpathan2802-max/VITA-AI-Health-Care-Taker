import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Profile, Lifestyle, NutritionTarget, Reminder, Meal, Product } from '../models/index.js';
import { calculateNutritionTargets } from '../services/nutritionEngine.js';
import { getDefaultReminders } from '../services/reminderService.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'vitacare_super_secret_jwt_key_2026_production';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, confirmPassword } = req.body;

    if (!fullName || !email || !mobileNumber || !password) {
      return res.status(400).json({ success: false, message: 'All registration fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobileNumber: mobileNumber.trim(),
      password: hashedPassword,
      role: 'user',
      isOnboarded: false,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to VitaCare.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'We could not complete your registration. Please try again.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        isOnboarded: user.isOnboarded,
        isDemoUser: user.isDemoUser || false,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'We could not log you in. Please check your connection and try again.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        isOnboarded: user.isOnboarded,
        isDemoUser: user.isDemoUser || false,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching account profile.' });
  }
};

export const loadDemoMode = async (req, res) => {
  try {
    // Check or create demo user
    let demoUser = await User.findOne({ email: 'demo@vitacare.ai' });
    if (!demoUser) {
      demoUser = await User.create({
        fullName: 'Rahul Sharma',
        email: 'demo@vitacare.ai',
        mobileNumber: '+91 98765 43210',
        password: 'demo_password_hash',
        role: 'user',
        isOnboarded: true,
        isDemoUser: true,
      });
    }

    // Set up demo profile
    await Profile.findOneAndUpdate(
      { userId: demoUser._id },
      {
        userId: demoUser._id,
        name: 'Rahul Sharma',
        age: 29,
        gender: 'Male',
        heightCm: 175,
        weightKg: 72,
        goals: ['Improve protein intake', 'Better nutrition awareness', 'Better hydration habits'],
        healthConditions: ['None reported'],
        medications: ['None reported'],
      },
      { upsert: true, new: true }
    );

    // Set up demo lifestyle
    await Lifestyle.findOneAndUpdate(
      { userId: demoUser._id },
      {
        userId: demoUser._id,
        workType: 'Desk job',
        workActivity: 'Mostly sitting',
        sittingDurationHours: 8,
        standingDurationHours: 2,
        screenTimeHours: 8,
        exerciseLevel: 'Lightly active',
        dailySteps: 5400,
        sleepTime: '23:30',
        wakeUpTime: '07:00',
        sleepDurationHours: 7.5,
        sleepConsistency: 'Mostly consistent',
        mealRoutine: {
          breakfastTime: '09:00',
          lunchTime: '13:30',
          snackTime: '17:00',
          dinnerTime: '20:30',
        },
        dietPreference: 'Vegetarian',
        foodPreferences: ['Ragi', 'Dal', 'Paneer', 'Sprouts', 'Fruits'],
        foodsDisliked: ['Bitter Gourd'],
        allergies: ['None'],
      },
      { upsert: true, new: true }
    );

    // Compute targets
    const targets = calculateNutritionTargets(
      { age: 29, gender: 'Male', heightCm: 175, weightKg: 72, goals: ['Improve protein intake'] },
      { exerciseLevel: 'Lightly active', sittingDurationHours: 8 }
    );

    await NutritionTarget.findOneAndUpdate(
      { userId: demoUser._id },
      { userId: demoUser._id, ...targets },
      { upsert: true, new: true }
    );

    // Ensure default reminders
    const reminders = getDefaultReminders(demoUser._id);
    for (const r of reminders) {
      await Reminder.findOneAndUpdate(
        { userId: demoUser._id, type: r.type },
        r,
        { upsert: true }
      );
    }

    const token = generateToken(demoUser._id);

    return res.json({
      success: true,
      message: 'Demo Mode loaded successfully. You can now explore all VitaCare features.',
      token,
      user: {
        id: demoUser._id,
        fullName: demoUser.fullName,
        email: demoUser.email,
        mobileNumber: demoUser.mobileNumber,
        role: demoUser.role,
        isOnboarded: true,
        isDemoUser: true,
      },
    });
  } catch (error) {
    console.error('Demo mode error:', error);
    return res.status(500).json({ success: false, message: 'Error loading Demo Mode.' });
  }
};
