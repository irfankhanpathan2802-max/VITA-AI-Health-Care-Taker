// Automated End-to-End Test Suite for VitaCare Backend & AI Services
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting VitaCare Automated Flow & Verification Tests...\n');
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, testName) {
    totalCount++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
    }
  }

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert(healthRes.status === 'healthy', 'Phase 1: Backend Health Check & Server Running');

    // 2. Register New User
    const testEmail = `testuser_${Date.now()}@vitacare.ai`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Ananya Sen',
        email: testEmail,
        mobileNumber: '+91 91234 56789',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }),
    }).then(r => r.json());
    assert(regRes.success && regRes.token, 'Phase 2: User Account Creation & JWT Authentication');
    const token = regRes.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // 3. Complete Personalized Onboarding
    const onboardRes = await fetch(`${BASE_URL}/profile/onboarding`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        personalInfo: { name: 'Ananya Sen', age: 27, gender: 'Female', heightCm: 165, weightKg: 58 },
        lifestyle: {
          workType: 'Desk job',
          workActivity: 'Mostly sitting',
          sittingDurationHours: 8,
          standingDurationHours: 2,
          screenTimeHours: 8,
          exerciseLevel: 'Lightly active',
          dailySteps: 6000,
          sleepTime: '23:00',
          wakeUpTime: '07:00',
          sleepDurationHours: 8,
          sleepConsistency: 'Mostly consistent',
          mealRoutine: { breakfastTime: '09:00', lunchTime: '13:30', snackTime: '17:00', dinnerTime: '20:30' },
          dietPreference: 'Vegetarian',
          foodPreferences: ['Ragi', 'Dal', 'Paneer', 'Sprouts'],
          allergies: [],
        },
        goals: ['Improve protein intake', 'Better nutrition awareness'],
      }),
    }).then(r => r.json());
    assert(onboardRes.success && onboardRes.targets && onboardRes.targets.proteinGrams > 0, 'Phase 3: Personalized Onboarding & Target Calculation');

    // 4. Initial Empty Dashboard State Check
    const todayStr = new Date().toISOString().split('T')[0];
    const initialMealsRes = await fetch(`${BASE_URL}/meals?date=${todayStr}`, { headers: authHeaders }).then(r => r.json());
    assert(initialMealsRes.success && initialMealsRes.meals.length === 0 && initialMealsRes.hasData === false && initialMealsRes.totalNutrition === null, 'Phase 4: Dashboard Starts Strictly Empty (No Fabricated Data)');

    // 5. Camera Food Validation (Strict Non-Food Rejection)
    const nonFoodRes = await fetch(`${BASE_URL}/ai/analyze-photo`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ filename: 'laptop_desk_screen.jpg' }),
    }).then(r => r.json());
    assert(nonFoodRes.isFood === false && nonFoodRes.message.includes('Food not detected'), 'Phase 5a: Camera Strict Non-Food Rejection (Laptop/Desk)');

    // 5b. Camera Food Validation (Valid Food Acceptance)
    const foodRes = await fetch(`${BASE_URL}/ai/analyze-photo`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ filename: 'roti_dal_egg_meal.jpg' }),
    }).then(r => r.json());
    assert(foodRes.isFood === true && foodRes.detectedItems.length > 0 && foodRes.totalEstimatedNutrition.calories > 0, 'Phase 5b: Camera Valid Food Detection & Nutrition Estimation');

    // 6. Voice Meal Logging
    const voiceRes = await fetch(`${BASE_URL}/ai/parse-voice`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ transcript: 'I had two eggs, two rotis and dal for breakfast' }),
    }).then(r => r.json());
    assert(voiceRes.success && voiceRes.understoodMealType === 'breakfast' && voiceRes.understoodItems.length >= 2, 'Phase 6: Voice Meal Logging & Natural Language Parsing');

    // 7. Manual Meal Logging
    const manualMealRes = await fetch(`${BASE_URL}/meals`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        mealType: 'breakfast',
        source: 'manual',
        items: [
          { name: 'Ragi Java', quantity: 1, unit: 'glass (250ml)', calories: 120, proteinGrams: 4.2, carbsGrams: 25, fatsGrams: 1.2, fiberGrams: 4.5 },
          { name: 'Sprouted Moong Salad', quantity: 1, unit: 'bowl (100g)', calories: 105, proteinGrams: 7.8, carbsGrams: 18, fatsGrams: 0.6, fiberGrams: 5.2 },
        ],
      }),
    }).then(r => r.json());
    assert(manualMealRes.success && manualMealRes.meal._id, 'Phase 7: Manual Multi-Item Meal Logging');

    // 8. Nutrition Calculation & Daily Tracking Update
    const updatedMealsRes = await fetch(`${BASE_URL}/meals?date=${todayStr}`, { headers: authHeaders }).then(r => r.json());
    assert(updatedMealsRes.hasData === true && updatedMealsRes.totalNutrition.proteinGrams === 12, 'Phase 8: Real-Time Nutrition Aggregation (12g protein logged)');

    // 9. Lifestyle & Ergonomics Analysis
    const lifestyleRes = await fetch(`${BASE_URL}/lifestyle/insights`, { headers: authHeaders }).then(r => r.json());
    assert(lifestyleRes.success && lifestyleRes.insights.recommendations.length > 0, 'Phase 9: Lifestyle & Ergonomic Practical Guidance');

    // 10. Smart Reminders & Missed Meal Detection
    const remindersRes = await fetch(`${BASE_URL}/reminders`, { headers: authHeaders }).then(r => r.json());
    assert(remindersRes.success && remindersRes.reminders.length >= 4, 'Phase 10: Smart Reminders Configured');

    // 11. End-of-Day Report (Strict Non-Fabrication)
    const dailyReportRes = await fetch(`${BASE_URL}/reports/daily?date=${todayStr}`, { headers: authHeaders }).then(r => r.json());
    assert(dailyReportRes.success && dailyReportRes.report.hasData === true && dailyReportRes.report.unloggedMeals.includes('lunch'), 'Phase 11: End-of-Day Report with Actual Logged Data & Unlogged Notice');

    // 12. Weekly & Monthly Reports
    const weeklyRes = await fetch(`${BASE_URL}/reports/weekly`, { headers: authHeaders }).then(r => r.json());
    assert(weeklyRes.success && weeklyRes.report.weeklyTrend.length === 7, 'Phase 12: Weekly Trend Report (Handling "No data" correctly)');

    // 13. AI Wellness Coach (Grounded in Real User Data)
    const coachRes = await fetch(`${BASE_URL}/ai/coach`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ message: 'What did I eat today?' }),
    }).then(r => r.json());
    assert(coachRes.success && coachRes.response.answer.includes('Ragi Java'), 'Phase 13: VitaCare AI Coach Grounded in User Meals');

    // 14. VitaCare Store
    const productsRes = await fetch(`${BASE_URL}/store/products`).then(r => r.json());
    assert(productsRes.success && productsRes.products.length >= 10, 'Phase 14: VitaCare Store Marketplace Catalog');

    // 15. AI -> Store Connection (Afternoon Protein Alert)
    const afternoonAlertRes = await fetch(`${BASE_URL}/ai/afternoon-alert`, { headers: authHeaders }).then(r => r.json());
    assert(afternoonAlertRes.success && afternoonAlertRes.alert.type === 'afternoon_protein_alert', 'Phase 15: AI -> Store Connection & Afternoon Protein Alert');

    // 16. Monthly Subscriptions
    const subRes = await fetch(`${BASE_URL}/store/subscriptions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ planType: 'High Protein Plan', frequency: 'Monthly', deliveryAddress: 'Test Address' }),
    }).then(r => r.json());
    assert(subRes.success && subRes.subscription.status === 'Active', 'Phase 16: Monthly Healthy-Food Subscription Created');

    // 17. Cart, Checkout & Orders
    const firstProduct = productsRes.products[0];
    const addToCartRes = await fetch(`${BASE_URL}/store/cart`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ productId: firstProduct._id, quantity: 2 }),
    }).then(r => r.json());
    assert(addToCartRes.success && addToCartRes.totalItems === 2, 'Phase 17a: Add to Cart');

    const checkoutRes = await fetch(`${BASE_URL}/store/checkout`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        shippingAddress: { fullName: 'Ananya Sen', phone: '+91 91234 56789', addressLine: 'Flat 101, Palm Residency', city: 'Hyderabad', state: 'Telangana', postalCode: '500081' }
      }),
    }).then(r => r.json());
    assert(checkoutRes.success && checkoutRes.order.orderStatus === 'Placed', 'Phase 17b: Checkout & Order Placement');

    // 18. Demo Mode Check
    const demoRes = await fetch(`${BASE_URL}/auth/demo`, { method: 'POST' }).then(r => r.json());
    assert(demoRes.success && demoRes.user.isDemoUser === true, 'Phase 18: Demo Mode Isolation & Instant Exploration');

    // 19. Dedicated Enquiry AI Assistant
    const enquiryRes = await fetch(`${BASE_URL}/ai/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enquiry: 'How do subscriptions work?' }),
    }).then(r => r.json());
    assert(enquiryRes.success && enquiryRes.result.topic === 'subscriptions' && enquiryRes.result.actionLink === '/subscriptions', 'Phase 19: Dedicated Concierge Enquiry AI Assistant');

    // 20. Missed Meal Protein Compensation
    const missedMealsRes = await fetch(`${BASE_URL}/reminders/missed-meals`, { headers: authHeaders }).then(r => r.json());
    assert(missedMealsRes.success && Array.isArray(missedMealsRes.notices), 'Phase 20: Missed Meal Alerts with Protein Compensation');

    console.log(`\n🎉 Verification Complete: ${passedCount}/${totalCount} tests passed!\n`);
  } catch (err) {
    console.error('Test run failed:', err);
  }
}

runTests();
