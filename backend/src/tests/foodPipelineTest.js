// VitaCare Food Vision & Nutrition Agent - 10 Automated Verification Tests
import { runFoodAnalysisPipeline } from '../services/foodVisionService.js';
import { lookupProductByBarcode } from '../services/barcodeService.js';
import { validateImageQuality } from '../services/foodValidationService.js';

async function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING VITACARE FOOD VISION & NUTRITION PIPELINE TEST SUITE');
  console.log('================================================================\n');

  let passedCount = 0;
  let totalCount = 10;

  // TEST 1: Water Bottle (Negative Validation)
  console.log('Test 1: Non-Food Object - Water Bottle');
  const t1 = await runFoodAnalysisPipeline({
    filename: 'water_bottle_on_desk.jpg',
    manualHint: 'water bottle',
  });
  const t1Pass = t1.foodDetection?.isFood === false && t1.foodDetection?.category === 'NON_FOOD';
  console.log(`  Result: isFood=${t1.foodDetection?.isFood}, category=${t1.foodDetection?.category}`);
  console.log(`  Message: "${t1.message}"`);
  console.log(`  Status: ${t1Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t1Pass) passedCount++;

  // TEST 2: Laptop (Negative Validation)
  console.log('Test 2: Non-Food Object - Laptop');
  const t2 = await runFoodAnalysisPipeline({
    filename: 'work_laptop_screen.jpg',
    manualHint: 'laptop computer',
  });
  const t2Pass = t2.foodDetection?.isFood === false && t2.foodDetection?.category === 'NON_FOOD';
  console.log(`  Result: isFood=${t2.foodDetection?.isFood}, category=${t2.foodDetection?.category}`);
  console.log(`  Status: ${t2Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t2Pass) passedCount++;

  // TEST 3: Boondi / Bonde Snack
  console.log('Test 3: Packaged Indian Snack - Boondi / Bonde');
  const t3 = await runFoodAnalysisPipeline({
    filename: 'kara_boondi_snack.jpg',
    manualHint: 'boondi',
  });
  const t3Pass =
    t3.foodDetection?.isFood === true &&
    (t3.foodIdentification?.name.toLowerCase().includes('boondi') || t3.foodIdentification?.name.toLowerCase().includes('bonde')) &&
    t3.nutrition?.calories > 200;
  console.log(`  Result: isFood=${t3.foodDetection?.isFood}, dish=${t3.foodIdentification?.name}, calories=${t3.nutrition?.calories} kcal, protein=${t3.nutrition?.protein_g}g`);
  console.log(`  Status: ${t3Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t3Pass) passedCount++;

  // TEST 4: Multi-Item Plate - Rice + Dal
  console.log('Test 4: Multi-Item Meal Plate - Rice and Dal');
  const t4 = await runFoodAnalysisPipeline({
    filename: 'lunch_plate_rice_dal.jpg',
    manualHint: 'rice and dal',
  });
  const hasRice = t4.items?.some((i) => i.name.toLowerCase().includes('rice'));
  const hasDal = t4.items?.some((i) => i.name.toLowerCase().includes('dal'));
  const t4Pass = t4.foodDetection?.isFood === true && hasRice && hasDal && t4.items.length >= 2;
  console.log(`  Result: isFood=${t4.foodDetection?.isFood}, items=[${t4.items?.map((i) => i.name).join(', ')}], totalCalories=${t4.nutrition?.calories} kcal`);
  console.log(`  Status: ${t4Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t4Pass) passedCount++;

  // TEST 5: Single Food - Apple
  console.log('Test 5: Fresh Fruit - Apple');
  const t5 = await runFoodAnalysisPipeline({
    filename: 'fresh_red_apple.jpg',
    manualHint: 'apple',
  });
  const t5Pass = t5.foodDetection?.isFood === true && t5.foodIdentification?.name === 'Apple' && t5.nutrition?.calories === 95;
  console.log(`  Result: isFood=${t5.foodDetection?.isFood}, dish=${t5.foodIdentification?.name}, calories=${t5.nutrition?.calories} kcal`);
  console.log(`  Status: ${t5Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t5Pass) passedCount++;

  // TEST 6: High Protein - Egg
  console.log('Test 6: Whole Food - Boiled Egg');
  const t6 = await runFoodAnalysisPipeline({
    filename: 'boiled_eggs_plate.jpg',
    manualHint: 'boiled eggs',
  });
  const t6Pass = t6.foodDetection?.isFood === true && t6.foodIdentification?.name.toLowerCase().includes('egg') && t6.nutrition?.protein_g >= 12;
  console.log(`  Result: isFood=${t6.foodDetection?.isFood}, dish=${t6.foodIdentification?.name}, protein=${t6.nutrition?.protein_g}g, calories=${t6.nutrition?.calories} kcal`);
  console.log(`  Status: ${t6Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t6Pass) passedCount++;

  // TEST 7: South Indian Breakfast - Idli
  console.log('Test 7: South Indian Dish - Idli');
  const t7 = await runFoodAnalysisPipeline({
    filename: 'steamed_idli_plate.jpg',
    manualHint: 'idli',
  });
  const t7Pass = t7.foodDetection?.isFood === true && t7.foodIdentification?.name === 'Idli' && t7.nutrition?.calories === 130;
  console.log(`  Result: isFood=${t7.foodDetection?.isFood}, dish=${t7.foodIdentification?.name}, calories=${t7.nutrition?.calories} kcal`);
  console.log(`  Status: ${t7Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t7Pass) passedCount++;

  // TEST 8: Healthy Millet - Ragi Dosa
  console.log('Test 8: Millet Preparation - Ragi Dosa');
  const t8 = await runFoodAnalysisPipeline({
    filename: 'ragi_dosa_breakfast.jpg',
    manualHint: 'ragi dosa',
  });
  const t8Pass = t8.foodDetection?.isFood === true && t8.foodIdentification?.name.toLowerCase().includes('ragi dosa');
  console.log(`  Result: isFood=${t8.foodDetection?.isFood}, dish=${t8.foodIdentification?.name}, calories=${t8.nutrition?.calories} kcal`);
  console.log(`  Status: ${t8Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t8Pass) passedCount++;

  // TEST 9: Packaged Food Barcode Lookup
  console.log('Test 9: Packaged Product Barcode - Haldirams Boondi (8901491101837)');
  const t9 = await lookupProductByBarcode('8901491101837');
  const t9Pass = t9.found === true && t9.product?.productName.toLowerCase().includes('boondi') && t9.product?.calories === 165;
  console.log(`  Result: found=${t9.found}, product=${t9.product?.productName}, brand=${t9.product?.brand}, calories=${t9.product?.calories} kcal`);
  console.log(`  Status: ${t9Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t9Pass) passedCount++;

  // TEST 10: Corrupt / Empty Buffer (Stage 1 Quality Check)
  console.log('Test 10: Corrupt / Too Small Buffer Quality Check');
  const emptyBuffer = Buffer.from('tiny');
  const t10Quality = validateImageQuality(emptyBuffer, 'image/jpeg');
  const t10 = await runFoodAnalysisPipeline({
    buffer: emptyBuffer,
    filename: 'corrupt_photo.jpg',
  });
  const t10Pass = t10Quality.isAcceptable === false && t10.foodDetection?.isFood === false;
  console.log(`  Result: isAcceptable=${t10Quality.isAcceptable}, reason=${t10Quality.message}, isFood=${t10.foodDetection?.isFood}`);
  console.log(`  Status: ${t10Pass ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (t10Pass) passedCount++;

  console.log('================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedCount} / ${totalCount} PASSED`);
  console.log('================================================================');

  if (passedCount === totalCount) {
    console.log('🎉 ALL 10 TEST CASES PASSED WITH 100% ACCURACY!');
    process.exit(0);
  } else {
    console.error(`⚠️ ${totalCount - passedCount} TEST(S) FAILED.`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
