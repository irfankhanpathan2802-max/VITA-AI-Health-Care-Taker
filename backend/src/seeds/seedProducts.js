import { Product } from '../models/index.js';

export const INITIAL_PRODUCTS = [
  // 1. HIGH PROTEIN
  {
    name: 'VitaCare High-Protein Clean Meal Box',
    category: 'HIGH PROTEIN',
    description: 'Freshly prepared meal box with grilled paneer/tofu or herb chicken, brown rice, steamed broccoli, and sprouted lentils.',
    price: 249,
    stock: 45,
    nutrition: { calories: 480, proteinGrams: 34, carbsGrams: 42, fatsGrams: 14, fiberGrams: 9 },
    ingredients: ['Paneer/Tofu', 'Sprouted Moong', 'Broccoli', 'Brown Rice', 'Olive Oil', 'Herbs'],
    image: '/images/salad_bowl.jpg',
    tags: ['High Protein', 'Gluten Free', 'Clean Eating'],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'Farm-Fresh Free-Range Eggs (Pack of 12)',
    category: 'HIGH PROTEIN',
    description: 'Organic free-range eggs enriched with omega-3 fatty acids. Packed with 6.3g high-biological-value protein per egg.',
    price: 140,
    stock: 100,
    nutrition: { calories: 74, proteinGrams: 6.3, carbsGrams: 0.4, fatsGrams: 5.0, fiberGrams: 0 },
    ingredients: ['Free-Range Hen Eggs'],
    image: '/images/boiled_eggs.jpg',
    tags: ['Organic', 'Omega-3', 'High Protein', 'Boiled Eggs'],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: 'Fresh Whole-Wheat Bread Omelette (High Protein Breakfast)',
    category: 'HIGH PROTEIN',
    description: 'Golden fluffy double-egg omelette with herbs tucked inside 100% whole wheat toasted bread. High biological value protein.',
    price: 130,
    stock: 75,
    nutrition: { calories: 295, proteinGrams: 18.5, carbsGrams: 24, fatsGrams: 12, fiberGrams: 4.2 },
    ingredients: ['Whole Wheat Bread', 'Farm Eggs', 'Onions', 'Green Chillies', 'Coriander', 'Olive Oil'],
    image: '/images/bread_omelette.jpg',
    tags: ['Breakfast', 'High Protein', 'Whole Wheat', 'Egg'],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'Artisanal Organic Malai Paneer (250g)',
    category: 'HIGH PROTEIN',
    description: 'Freshly curdled, hormone-free cottage cheese with a rich, soft texture. Superior vegetarian protein and bioavailable calcium.',
    price: 165,
    stock: 60,
    nutrition: { calories: 265, proteinGrams: 18, carbsGrams: 3.5, fatsGrams: 20, fiberGrams: 0 },
    ingredients: ['Pasteurized Whole Cow Milk', 'Citric Acid'],
    image: '/images/paneer.jpg',
    tags: ['Dairy', 'Vegetarian', 'Calcium Rich'],
    rating: 4.9,
    isFeatured: false,
  },
  {
    name: 'Organic Sprouted Moong & Chickpea Mix (300g)',
    category: 'HIGH PROTEIN',
    description: 'Ready-to-eat sprouted legumes rich in live enzymes, bioavailable iron, fiber, and plant-based protein.',
    price: 110,
    stock: 75,
    nutrition: { calories: 120, proteinGrams: 9.5, carbsGrams: 20, fatsGrams: 1.0, fiberGrams: 7.5 },
    ingredients: ['Sprouted Green Moong', 'Sprouted Brown Chickpeas'],
    image: '/images/sprouts.jpg',
    tags: ['Vegan', 'Live Enzymes', 'High Fiber'],
    rating: 4.7,
    isFeatured: true,
  },

  // 2. HEALTHY BREAKFAST
  {
    name: 'Heritage Sprouted Ragi Flour (500g)',
    category: 'HEALTHY BREAKFAST',
    description: 'Traditional stone-ground sprouted finger millet (Ragi). Ideal for making authentic Ragi Java, porridge, or nutrient-dense rotis.',
    price: 120,
    stock: 80,
    nutrition: { calories: 328, proteinGrams: 7.3, carbsGrams: 72, fatsGrams: 1.3, fiberGrams: 11.5 },
    ingredients: ['100% Whole Sprouted Finger Millet (Ragi)'],
    image: '/images/ragi_java.jpg',
    tags: ['Ragi', 'Millets', 'Calcium Champion', 'Gluten Free'],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'VitaCare Instant Ragi Java Wellness Mix (350g)',
    category: 'HEALTHY BREAKFAST',
    description: 'Pre-cooked sprouted ragi blend with cardamom, roasted almonds, and flaxseed. Just add warm milk or water for a 2-minute nourishing breakfast.',
    price: 195,
    stock: 90,
    nutrition: { calories: 140, proteinGrams: 5.2, carbsGrams: 26, fatsGrams: 2.1, fiberGrams: 5.8 },
    ingredients: ['Sprouted Ragi', 'Crushed Almonds', 'Flaxseed Powder', 'Green Cardamom'],
    image: '/images/ragi_java.jpg',
    tags: ['Ragi Java', 'Breakfast', 'Low GI', 'Heart Healthy'],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: 'Gluten-Free Rolled Oats & Ancient Grains (500g)',
    category: 'HEALTHY BREAKFAST',
    description: 'Steamed and rolled whole oats blended with amaranth and chia seeds for slow-release morning carbohydrates and high beta-glucan fiber.',
    price: 185,
    stock: 85,
    nutrition: { calories: 375, proteinGrams: 13.5, carbsGrams: 62, fatsGrams: 6.5, fiberGrams: 10.2 },
    ingredients: ['Rolled Oats', 'Puffed Amaranth', 'Black Chia Seeds'],
    image: '/images/rolled_oats.jpg',
    tags: ['Beta Glucan', 'Heart Healthy', 'High Fiber', 'Oats'],
    rating: 4.7,
    isFeatured: false,
  },
  {
    name: 'Multi-Millet Breakfast Flakes (400g)',
    category: 'HEALTHY BREAKFAST',
    description: 'Crisp flakes made from Foxtail, Kodo, and Little millets. Free from refined sugars and artificial preservatives.',
    price: 170,
    stock: 70,
    nutrition: { calories: 340, proteinGrams: 9.8, carbsGrams: 68, fatsGrams: 2.2, fiberGrams: 8.0 },
    ingredients: ['Foxtail Millet', 'Kodo Millet', 'Little Millet', 'Rock Salt'],
    image: '/images/rolled_oats.jpg',
    tags: ['Millets', 'No Added Sugar', 'Crispy'],
    rating: 4.6,
    isFeatured: false,
  },

  // 3. FRUITS & FRESH FOODS
  {
    name: 'Seasonal Antioxidant Fruit Box (1.5 kg)',
    category: 'FRUITS & FRESH FOODS',
    description: 'Handpicked fresh organic fruits including Red Papaya, Crisp Himalayan Apples, Sweet Pomegranate, and Green Guava.',
    price: 299,
    stock: 40,
    nutrition: { calories: 95, proteinGrams: 1.2, carbsGrams: 24, fatsGrams: 0.3, fiberGrams: 3.8 },
    ingredients: ['Papaya', 'Apple', 'Pomegranate', 'Guava'],
    image: '/images/fruits.jpg',
    tags: ['Fresh', 'Antioxidants', 'Vitamin C'],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'Raw California Almonds & Walnut Halves (250g)',
    category: 'FRUITS & FRESH FOODS',
    description: 'Unsalted, unroasted premium tree nuts packed with healthy monounsaturated fats, plant omega-3s, and vitamin E.',
    price: 349,
    stock: 65,
    nutrition: { calories: 590, proteinGrams: 19.5, carbsGrams: 16, fatsGrams: 52, fiberGrams: 11 },
    ingredients: ['Raw Whole Almonds', 'Walnut Halves'],
    image: '/images/almonds_walnuts.jpg',
    tags: ['Brain Food', 'Healthy Fats', 'Vitamin E'],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'Super 5 Seed Mix - Pumpkin, Chia, Sunflower, Flax, Sesame (200g)',
    category: 'FRUITS & FRESH FOODS',
    description: 'Nutrient powerhouse seed mix loaded with zinc, magnesium, and dietary lignans. Perfect topper for oats, salads, and smoothies.',
    price: 199,
    stock: 80,
    nutrition: { calories: 535, proteinGrams: 21, carbsGrams: 18, fatsGrams: 42, fiberGrams: 14 },
    ingredients: ['Pumpkin Seeds', 'Chia Seeds', 'Sunflower Seeds', 'Flax Seeds', 'White Sesame'],
    image: '/images/seed_mix.jpg',
    tags: ['Zinc Rich', 'Omega 3', 'Superfood'],
    rating: 4.8,
    isFeatured: false,
  },

  // 4. HEALTHY READY-TO-EAT
  {
    name: 'Mediterranean Grilled Paneer & Quinoa Bowl',
    category: 'HEALTHY READY-TO-EAT',
    description: 'Herb-marinated grilled paneer served over warm fluffy quinoa, roasted bell peppers, zucchini, and a lemon tahini dressing.',
    price: 279,
    stock: 35,
    nutrition: { calories: 420, proteinGrams: 22, carbsGrams: 38, fatsGrams: 18, fiberGrams: 7 },
    ingredients: ['Paneer', 'Quinoa', 'Bell Peppers', 'Zucchini', 'Tahini', 'Lemon Juice'],
    image: '/images/salad_bowl.jpg',
    tags: ['Ready to Eat', 'Gluten Free', 'Mediterranean'],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: 'Slow-Simmered Lentil & Vegetable Detox Soup (400ml)',
    category: 'HEALTHY READY-TO-EAT',
    description: 'Warm soothing soup prepared with yellow moong lentils, baby spinach, turmeric, ginger, and cumin. Gentle on gut and comforting.',
    price: 159,
    stock: 50,
    nutrition: { calories: 180, proteinGrams: 11, carbsGrams: 26, fatsGrams: 3.5, fiberGrams: 8.2 },
    ingredients: ['Moong Dal', 'Spinach', 'Ginger', 'Turmeric', 'Cumin', 'Rock Salt'],
    image: '/images/soup.jpg',
    tags: ['Detox', 'Gut Friendly', 'Comfort Food'],
    rating: 4.8,
    isFeatured: false,
  },
  {
    name: 'Roasted Makhana (Fox Nuts) Himalayan Pink Salt (100g)',
    category: 'HEALTHY READY-TO-EAT',
    description: 'Crispy air-popped fox nuts tossed lightly in pure cold-pressed olive oil and Himalayan pink rock salt. Low calorie, zero guilt snack.',
    price: 135,
    stock: 90,
    nutrition: { calories: 175, proteinGrams: 4.8, carbsGrams: 28, fatsGrams: 4.0, fiberGrams: 3.2 },
    ingredients: ['Fox Nuts (Makhana)', 'Cold-Pressed Olive Oil', 'Pink Himalayan Salt'],
    image: '/images/makhana.jpg',
    tags: ['Low Calorie', 'Snack', 'Zero Cholesterol'],
    rating: 4.7,
    isFeatured: false,
  },
];

export const seedProductsIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[VitaCare Seed] Seeding initial verified store products...');
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log(`[VitaCare Seed] Successfully seeded ${INITIAL_PRODUCTS.length} store products.`);
    } else {
      // Synchronize product images and details so that updated food images take effect immediately
      for (const prod of INITIAL_PRODUCTS) {
        await Product.findOneAndUpdate(
          { name: prod.name },
          { $set: { image: prod.image, description: prod.description, nutrition: prod.nutrition } },
          { upsert: true }
        );
      }
      console.log('[VitaCare Seed] Synchronized verified food images for existing store products.');
    }
  } catch (err) {
    console.error('[VitaCare Seed] Error seeding products:', err.message);
  }
};
