import React, { useState } from 'react';
import { Plus, Trash2, X, Search, CheckCircle2, ChevronDown } from 'lucide-react';
import { apiRequest } from '../services/api.js';

// Comprehensive verified common foods database with standard baseline nutrition
const COMMON_FOODS = [
  {
    name: 'Cooked White Rice',
    category: 'grain',
    standardUnit: 'cup',
    unitLabel: 'cup (cooked, 150g)',
    measurements: [
      { label: '1 cup (150g)', qty: 1 },
      { label: '2 cups (300g)', qty: 2 },
      { label: '0.5 cup (75g)', qty: 0.5 },
      { label: '1.5 cups (225g)', qty: 1.5 },
    ],
    calories: 195,
    proteinGrams: 4.0,
    carbsGrams: 43.0,
    fatsGrams: 0.5,
    fiberGrams: 0.6,
  },
  {
    name: 'Cooked Brown Rice',
    category: 'grain',
    standardUnit: 'cup',
    unitLabel: 'cup (cooked, 150g)',
    measurements: [
      { label: '1 cup (150g)', qty: 1 },
      { label: '2 cups (300g)', qty: 2 },
      { label: '0.5 cup (75g)', qty: 0.5 },
    ],
    calories: 215,
    proteinGrams: 5.0,
    carbsGrams: 45.0,
    fatsGrams: 1.8,
    fiberGrams: 3.5,
  },
  {
    name: 'Roti (Whole Wheat Chapati)',
    category: 'grain',
    standardUnit: 'piece',
    unitLabel: 'piece',
    measurements: [
      { label: '1 piece', qty: 1 },
      { label: '2 pieces', qty: 2 },
      { label: '3 pieces', qty: 3 },
      { label: '4 pieces', qty: 4 },
    ],
    calories: 85,
    proteinGrams: 3.1,
    carbsGrams: 16.0,
    fatsGrams: 0.5,
    fiberGrams: 2.8,
  },
  {
    name: 'Yellow Dal (Cooked Tadka)',
    category: 'pulse',
    standardUnit: 'bowl',
    unitLabel: 'bowl (150g)',
    measurements: [
      { label: '1 bowl (150g)', qty: 1 },
      { label: '2 bowls (300g)', qty: 2 },
      { label: '0.5 bowl (75g)', qty: 0.5 },
      { label: '1 cup (200g)', qty: 1.33 },
    ],
    calories: 145,
    proteinGrams: 9.0,
    carbsGrams: 22.0,
    fatsGrams: 2.5,
    fiberGrams: 6.0,
  },
  {
    name: 'Boiled Egg',
    category: 'protein',
    standardUnit: 'piece',
    unitLabel: 'piece',
    measurements: [
      { label: '1 egg', qty: 1 },
      { label: '2 eggs', qty: 2 },
      { label: '3 eggs', qty: 3 },
      { label: '4 eggs', qty: 4 },
    ],
    calories: 74,
    proteinGrams: 6.3,
    carbsGrams: 0.4,
    fatsGrams: 5.0,
    fiberGrams: 0,
  },
  {
    name: 'Egg Omelette (with onion & chili)',
    category: 'protein',
    standardUnit: 'serving',
    unitLabel: 'serving (2 eggs)',
    measurements: [
      { label: '1 serving (2 eggs)', qty: 1 },
      { label: 'Double (4 eggs)', qty: 2 },
    ],
    calories: 180,
    proteinGrams: 13.0,
    carbsGrams: 2.0,
    fatsGrams: 14.0,
    fiberGrams: 0.5,
  },
  {
    name: 'Paneer (Cottage Cheese)',
    category: 'protein',
    standardUnit: 'serving',
    unitLabel: 'serving (100g)',
    measurements: [
      { label: '100g (1 serving)', qty: 1 },
      { label: '150g (1.5 servings)', qty: 1.5 },
      { label: '50g (half serving)', qty: 0.5 },
      { label: '200g (2 servings)', qty: 2 },
    ],
    calories: 265,
    proteinGrams: 18.0,
    carbsGrams: 3.5,
    fatsGrams: 20.0,
    fiberGrams: 0,
  },
  {
    name: 'Grilled Chicken Breast',
    category: 'protein',
    standardUnit: 'serving',
    unitLabel: 'serving (100g)',
    measurements: [
      { label: '100g (1 serving)', qty: 1 },
      { label: '150g (1.5 servings)', qty: 1.5 },
      { label: '200g (2 servings)', qty: 2 },
    ],
    calories: 165,
    proteinGrams: 31.0,
    carbsGrams: 0,
    fatsGrams: 3.6,
    fiberGrams: 0,
  },
  {
    name: 'Ragi Java (Finger Millet Drink)',
    category: 'breakfast',
    standardUnit: 'glass',
    unitLabel: 'glass (250ml)',
    measurements: [
      { label: '1 glass (250ml)', qty: 1 },
      { label: '2 glasses (500ml)', qty: 2 },
      { label: '1 cup (150ml)', qty: 0.6 },
    ],
    calories: 120,
    proteinGrams: 4.2,
    carbsGrams: 25.0,
    fatsGrams: 1.2,
    fiberGrams: 4.5,
  },
  {
    name: 'Idli with Sambar',
    category: 'breakfast',
    standardUnit: 'serving',
    unitLabel: 'plate (2 idlis + sambar)',
    measurements: [
      { label: '2 idlis + sambar', qty: 1 },
      { label: '3 idlis + sambar', qty: 1.5 },
      { label: '4 idlis + sambar', qty: 2 },
    ],
    calories: 210,
    proteinGrams: 7.0,
    carbsGrams: 42.0,
    fatsGrams: 1.5,
    fiberGrams: 4.0,
  },
  {
    name: 'Plain Dosa with Chutney',
    category: 'breakfast',
    standardUnit: 'piece',
    unitLabel: 'piece',
    measurements: [
      { label: '1 dosa', qty: 1 },
      { label: '2 dosas', qty: 2 },
    ],
    calories: 170,
    proteinGrams: 4.0,
    carbsGrams: 28.0,
    fatsGrams: 5.0,
    fiberGrams: 1.5,
  },
  {
    name: 'Rolled Oats Porridge',
    category: 'breakfast',
    standardUnit: 'bowl',
    unitLabel: 'bowl (200g)',
    measurements: [
      { label: '1 bowl (200g)', qty: 1 },
      { label: '1 cup (150g)', qty: 0.75 },
      { label: 'Large bowl (300g)', qty: 1.5 },
    ],
    calories: 160,
    proteinGrams: 6.0,
    carbsGrams: 28.0,
    fatsGrams: 3.0,
    fiberGrams: 4.0,
  },
  {
    name: 'Greek Yogurt / Curd (Plain)',
    category: 'dairy',
    standardUnit: 'cup',
    unitLabel: 'cup (150g)',
    measurements: [
      { label: '1 cup (150g)', qty: 1 },
      { label: '2 cups (300g)', qty: 2 },
      { label: '1 small bowl (100g)', qty: 0.67 },
    ],
    calories: 130,
    proteinGrams: 15.0,
    carbsGrams: 6.0,
    fatsGrams: 4.0,
    fiberGrams: 0,
  },
  {
    name: 'Sprouted Moong Salad',
    category: 'protein',
    standardUnit: 'bowl',
    unitLabel: 'bowl (100g)',
    measurements: [
      { label: '1 bowl (100g)', qty: 1 },
      { label: '2 bowls (200g)', qty: 2 },
      { label: '0.5 bowl (50g)', qty: 0.5 },
    ],
    calories: 105,
    proteinGrams: 7.8,
    carbsGrams: 18.0,
    fatsGrams: 0.6,
    fiberGrams: 5.2,
  },
  {
    name: 'Tofu (Firm)',
    category: 'protein',
    standardUnit: 'serving',
    unitLabel: 'serving (100g)',
    measurements: [
      { label: '100g (1 serving)', qty: 1 },
      { label: '150g (1.5 servings)', qty: 1.5 },
      { label: '200g (2 servings)', qty: 2 },
    ],
    calories: 144,
    proteinGrams: 17.0,
    carbsGrams: 3.0,
    fatsGrams: 8.5,
    fiberGrams: 2.0,
  },
  {
    name: 'Mixed Fruit Bowl (Papaya, Apple, Pomegranate)',
    category: 'fruit',
    standardUnit: 'bowl',
    unitLabel: 'bowl (150g)',
    measurements: [
      { label: '1 bowl (150g)', qty: 1 },
      { label: '2 bowls (300g)', qty: 2 },
      { label: '1 cup (120g)', qty: 0.8 },
    ],
    calories: 95,
    proteinGrams: 1.2,
    carbsGrams: 24.0,
    fatsGrams: 0.3,
    fiberGrams: 3.8,
  },
  {
    name: 'Green Salad with Cucumber & Tomato',
    category: 'vegetable',
    standardUnit: 'plate',
    unitLabel: 'plate (120g)',
    measurements: [
      { label: '1 plate (120g)', qty: 1 },
      { label: '2 plates (240g)', qty: 2 },
    ],
    calories: 35,
    proteinGrams: 1.5,
    carbsGrams: 7.0,
    fatsGrams: 0.2,
    fiberGrams: 2.5,
  },
  {
    name: 'Almonds & Walnuts',
    category: 'snack',
    standardUnit: 'handful',
    unitLabel: 'handful (30g)',
    measurements: [
      { label: '1 handful (30g)', qty: 1 },
      { label: '2 handfuls (60g)', qty: 2 },
      { label: 'Half handful (15g)', qty: 0.5 },
    ],
    calories: 185,
    proteinGrams: 5.5,
    carbsGrams: 5.0,
    fatsGrams: 16.0,
    fiberGrams: 3.0,
  },
  {
    name: 'Roasted Makhana (Fox Nuts)',
    category: 'snack',
    standardUnit: 'bowl',
    unitLabel: 'bowl (50g)',
    measurements: [
      { label: '1 bowl (50g)', qty: 1 },
      { label: '2 bowls (100g)', qty: 2 },
      { label: '0.5 bowl (25g)', qty: 0.5 },
    ],
    calories: 175,
    proteinGrams: 4.8,
    carbsGrams: 28.0,
    fatsGrams: 4.0,
    fiberGrams: 3.2,
  },
  {
    name: 'Whole Milk (Cow)',
    category: 'dairy',
    standardUnit: 'glass',
    unitLabel: 'glass (250ml)',
    measurements: [
      { label: '1 glass (250ml)', qty: 1 },
      { label: '1 cup (150ml)', qty: 0.6 },
      { label: '2 glasses (500ml)', qty: 2 },
    ],
    calories: 150,
    proteinGrams: 8.0,
    carbsGrams: 12.0,
    fatsGrams: 8.0,
    fiberGrams: 0,
  },
];

export const MEAL_APPROPRIATE_NAMES = {
  breakfast: [
    'Idli with Sambar',
    'Plain Dosa with Chutney',
    'Boiled Egg',
    'Egg Omelette (with onion & chili)',
    'Ragi Java (Finger Millet Drink)',
    'Rolled Oats Porridge',
    'Sprouted Moong Salad',
    'Whole Milk (Cow)',
    'Mixed Fruit Bowl (Papaya, Apple, Pomegranate)',
  ],
  lunch: [
    'Cooked White Rice',
    'Cooked Brown Rice',
    'Roti (Whole Wheat Chapati)',
    'Yellow Dal (Cooked Tadka)',
    'Paneer (Cottage Cheese)',
    'Grilled Chicken Breast',
    'Greek Yogurt / Curd (Plain)',
    'Green Salad (Cucumber, Tomato, Carrot)',
  ],
  snacks: [
    'Roasted Makhana (Fox Nuts)',
    'Sprouted Moong Salad',
    'Mixed Fruit Bowl (Papaya, Apple, Pomegranate)',
    'Almonds & Walnuts',
    'Greek Yogurt / Curd (Plain)',
    'Whole Milk (Cow)',
  ],
  dinner: [
    'Roti (Whole Wheat Chapati)',
    'Yellow Dal (Cooked Tadka)',
    'Cooked Brown Rice',
    'Tofu (Firm)',
    'Paneer (Cottage Cheese)',
    'Green Salad (Cucumber, Tomato, Carrot)',
    'Cooked White Rice',
  ],
};

const getDefaultItemForMeal = (type) => {
  let targetFoodName = 'Idli with Sambar';
  if (type === 'lunch') targetFoodName = 'Cooked White Rice';
  else if (type === 'snacks') targetFoodName = 'Sprouted Moong Salad';
  else if (type === 'dinner') targetFoodName = 'Roti (Whole Wheat Chapati)';

  const food = COMMON_FOODS.find((f) => f.name === targetFoodName) || COMMON_FOODS[0];
  const m = food.measurements[0];
  return {
    name: food.name,
    quantity: m.qty,
    unit: food.unitLabel,
    selectedMeasurement: m.label,
    baseCalories: food.calories,
    baseProtein: food.proteinGrams,
    baseCarbs: food.carbsGrams,
    baseFats: food.fatsGrams,
    baseFiber: food.fiberGrams,
    calories: Math.round(food.calories * m.qty),
    proteinGrams: Math.round(food.proteinGrams * m.qty * 10) / 10,
    carbsGrams: Math.round(food.carbsGrams * m.qty * 10) / 10,
    fatsGrams: Math.round(food.fatsGrams * m.qty * 10) / 10,
    fiberGrams: Math.round(food.fiberGrams * m.qty * 10) / 10,
  };
};

export const ManualMealModal = ({
  isOpen,
  onClose,
  initialMealType = 'breakfast',
  onMealSaved,
}) => {
  if (!isOpen) return null;

  const [mealType, setMealType] = useState(initialMealType);
  const [timeLogged, setTimeLogged] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  // Items currently in the meal (initialized with meal-appropriate food)
  const [items, setItems] = useState([getDefaultItemForMeal(initialMealType)]);

  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Get appropriate foods for current mealType
  const currentAppropriateNames = MEAL_APPROPRIATE_NAMES[mealType] || MEAL_APPROPRIATE_NAMES.breakfast;

  // Filter and sort common foods so meal-appropriate foods appear first
  const filteredCommonFoods = COMMON_FOODS.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
  ).sort((a, b) => {
    const aMatch = currentAppropriateNames.includes(a.name);
    const bMatch = currentAppropriateNames.includes(b.name);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const handleAddPresetFood = (food) => {
    const defaultMeasure = food.measurements[0];
    const qty = defaultMeasure.qty;

    setItems((prev) => [
      ...prev,
      {
        name: food.name,
        quantity: qty,
        unit: food.unitLabel,
        selectedMeasurement: defaultMeasure.label,
        baseCalories: food.calories,
        baseProtein: food.proteinGrams,
        baseCarbs: food.carbsGrams,
        baseFats: food.fatsGrams,
        baseFiber: food.fiberGrams,
        calories: Math.round(food.calories * qty),
        proteinGrams: Math.round(food.proteinGrams * qty * 10) / 10,
        carbsGrams: Math.round(food.carbsGrams * qty * 10) / 10,
        fatsGrams: Math.round(food.fatsGrams * qty * 10) / 10,
        fiberGrams: Math.round(food.fiberGrams * qty * 10) / 10,
      },
    ]);
  };

  const handleAddBlankCustomItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: '',
        quantity: 1,
        unit: 'serving',
        selectedMeasurement: '1 serving',
        baseCalories: 100,
        baseProtein: 5,
        baseCarbs: 15,
        baseFats: 3,
        baseFiber: 2,
        calories: 100,
        proteinGrams: 5,
        carbsGrams: 15,
        fatsGrams: 3,
        fiberGrams: 2,
      },
    ]);
  };

  const handleMeasurementChange = (index, measurementLabel, foodDef) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const foundMeasure = foodDef?.measurements?.find((m) => m.label === measurementLabel);
          const newQty = foundMeasure ? foundMeasure.qty : 1;
          const baseCal = item.baseCalories || item.calories;
          const baseProt = item.baseProtein !== undefined ? item.baseProtein : item.proteinGrams;
          const baseCarb = item.baseCarbs !== undefined ? item.baseCarbs : item.carbsGrams;
          const baseFat = item.baseFats !== undefined ? item.baseFats : item.fatsGrams;
          const baseFib = item.baseFiber !== undefined ? item.baseFiber : item.fiberGrams;

          return {
            ...item,
            quantity: newQty,
            selectedMeasurement: measurementLabel,
            calories: Math.round(baseCal * newQty),
            proteinGrams: Math.round(baseProt * newQty * 10) / 10,
            carbsGrams: Math.round(baseCarb * newQty * 10) / 10,
            fatsGrams: Math.round(baseFat * newQty * 10) / 10,
            fiberGrams: Math.round(baseFib * newQty * 10) / 10,
          };
        }
        return item;
      })
    );
  };

  const handleQuantityMultiplierChange = (index, delta) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const newQty = Math.max(0.5, Math.round((item.quantity + delta) * 10) / 10);
          const ratio = newQty / (item.quantity || 1);
          return {
            ...item,
            quantity: newQty,
            calories: Math.round(item.calories * ratio),
            proteinGrams: Math.round(item.proteinGrams * ratio * 10) / 10,
            carbsGrams: Math.round(item.carbsGrams * ratio * 10) / 10,
            fatsGrams: Math.round(item.fatsGrams * ratio * 10) / 10,
            fiberGrams: Math.round(item.fiberGrams * ratio * 10) / 10,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateItemField = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalNutrition = items.reduce(
    (acc, item) => ({
      calories: acc.calories + (Number(item.calories) || 0),
      proteinGrams: Math.round((acc.proteinGrams + (Number(item.proteinGrams) || 0)) * 10) / 10,
      carbsGrams: Math.round((acc.carbsGrams + (Number(item.carbsGrams) || 0)) * 10) / 10,
      fatsGrams: Math.round((acc.fatsGrams + (Number(item.fatsGrams) || 0)) * 10) / 10,
      fiberGrams: Math.round((acc.fiberGrams + (Number(item.fiberGrams) || 0)) * 10) / 10,
    }),
    { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 }
  );

  const handleSave = async () => {
    const validItems = items.filter((i) => i.name.trim().length > 0);
    if (validItems.length === 0) {
      alert('Please enter at least one food item.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await apiRequest('/meals', {
        method: 'POST',
        body: JSON.stringify({
          mealType,
          timeLogged,
          source: 'manual',
          items: validItems,
        }),
      });

      if (res.success) {
        if (onMealSaved) onMealSaved(res.meal);
        onClose();
      }
    } catch (err) {
      alert('Failed to save meal: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Verified Food Database & Portions
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
            Manual Meal Entry
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Select common foods with pre-calculated measurements (cups, pieces, bowls) or enter custom dishes.
          </p>
        </div>

        {/* Meal Category & Time */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Meal Slot</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-gray-50 focus:bg-white focus:border-emerald-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Time Logged</label>
            <input
              type="time"
              value={timeLogged}
              onChange={(e) => setTimeLogged(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-gray-50 focus:bg-white focus:border-emerald-500"
            />
          </div>
        </div>

        {/* COMMON FOODS DOWNLIST / QUICK SELECTOR */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Appropriate Foods for {mealType.charAt(0).toUpperCase() + mealType.slice(1)} (Click to Add):
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Auto-calculates nutrients
            </span>
          </div>

          {/* Quick-Add Chips for the selected meal type */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {currentAppropriateNames.map((foodName) => {
                const foodObj = COMMON_FOODS.find((f) => f.name === foodName);
                if (!foodObj) return null;
                return (
                  <button
                    key={foodName}
                    type="button"
                    onClick={() => handleAddPresetFood(foodObj)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-emerald-950 border border-emerald-300/80 text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    {foodName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute top-2.5 left-3" />
            <input
              type="text"
              placeholder={`Search all foods for ${mealType} (e.g. Idli, Dosa, Rice, Dal, Eggs)...`}
              value={foodSearchQuery}
              onChange={(e) => setFoodSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Preset Buttons Grid */}
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredCommonFoods.slice(0, 14).map((food, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddPresetFood(food)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-gray-800 border border-gray-200 hover:border-emerald-600 text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs"
              >
                <Plus className="w-3 h-3" />
                {food.name}
              </button>
            ))}
          </div>
        </div>

        {/* LOGGED ITEMS LIST */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Selected Meal Items ({items.length}):
            </span>
            <button
              type="button"
              onClick={handleAddBlankCustomItem}
              className="text-xs text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Food
            </button>
          </div>

          {items.map((item, idx) => {
            const matchedFood = COMMON_FOODS.find(
              (f) => f.name.toLowerCase() === item.name.toLowerCase()
            );

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItemField(idx, 'name', e.target.value)}
                    placeholder="Food name (e.g. Cooked Rice)"
                    className="flex-1 font-bold text-sm text-gray-950 bg-white px-3 py-1.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none"
                  />

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Measurement & Quantity Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      Measurement / Portion Size
                    </label>
                    {matchedFood && matchedFood.measurements ? (
                      <select
                        value={item.selectedMeasurement || matchedFood.measurements[0].label}
                        onChange={(e) =>
                          handleMeasurementChange(idx, e.target.value, matchedFood)
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:border-emerald-500"
                      >
                        {matchedFood.measurements.map((m, mIdx) => (
                          <option key={mIdx} value={m.label}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleUpdateItemField(idx, 'unit', e.target.value)}
                        placeholder="e.g. 1 cup, 2 pieces"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-semibold text-gray-800"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      Quantity Multiplier
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden max-w-max">
                      <button
                        type="button"
                        onClick={() => handleQuantityMultiplierChange(idx, -0.5)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-gray-900 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityMultiplierChange(idx, 0.5)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Macronutrient breakdown */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">
                      Calories
                    </span>
                    <input
                      type="number"
                      value={item.calories}
                      onChange={(e) =>
                        handleUpdateItemField(idx, 'calories', Number(e.target.value))
                      }
                      className="w-full text-center font-bold text-gray-900 text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-emerald-600 block uppercase font-bold">
                      Protein (g)
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={item.proteinGrams}
                      onChange={(e) =>
                        handleUpdateItemField(idx, 'proteinGrams', Number(e.target.value))
                      }
                      className="w-full text-center font-bold text-emerald-700 text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">
                      Carbs (g)
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={item.carbsGrams}
                      onChange={(e) =>
                        handleUpdateItemField(idx, 'carbsGrams', Number(e.target.value))
                      }
                      className="w-full text-center font-bold text-gray-900 text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">
                      Fats (g)
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={item.fatsGrams}
                      onChange={(e) =>
                        handleUpdateItemField(idx, 'fatsGrams', Number(e.target.value))
                      }
                      className="w-full text-center font-bold text-gray-900 text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* TOTAL MEAL NUTRITION SUMMARY */}
        <div className="p-4 rounded-2xl bg-emerald-900 text-white mb-6 shadow-md">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-emerald-200 uppercase tracking-wider">
              Total Meal Nutrition:
            </span>
            <span className="text-base font-extrabold text-white">
              {totalNutrition.calories} kcal
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="text-emerald-300 block text-[9px] uppercase font-bold">Protein</span>
              <span className="font-extrabold text-white">{totalNutrition.proteinGrams}g</span>
            </div>
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="text-emerald-300 block text-[9px] uppercase font-bold">Carbs</span>
              <span className="font-extrabold text-white">{totalNutrition.carbsGrams}g</span>
            </div>
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="text-emerald-300 block text-[9px] uppercase font-bold">Fats</span>
              <span className="font-extrabold text-white">{totalNutrition.fatsGrams}g</span>
            </div>
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="text-emerald-300 block text-[9px] uppercase font-bold">Fiber</span>
              <span className="font-extrabold text-white">{totalNutrition.fiberGrams}g</span>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSaving ? 'Logging Meal...' : 'Save Meal to Daily Tracker'}
        </button>
      </div>
    </div>
  );
};
