// Stage 4: Packaged Food Recognition & Optional Barcode Service
// Barcode scanning is strictly optional and enhances packaged food accuracy.

export const PACKAGED_PRODUCTS_DATABASE = [
  {
    barcode: '8901491101837',
    brand: "Haldiram's",
    productName: 'Boondi (Classic Salted)',
    flavor: 'Salted',
    packageSize: '200g',
    servingSize: '30g',
    calories: 165,
    protein_g: 3.5,
    carbohydrates_g: 15.0,
    fat_g: 10.0,
    fiber_g: 1.5,
    sugar_g: 0.2,
    sodium_mg: 180,
  },
  {
    barcode: '8901491101844',
    brand: "Haldiram's",
    productName: 'Kara Boondi (Spicy)',
    flavor: 'Spicy Masala',
    packageSize: '200g',
    servingSize: '30g',
    calories: 170,
    protein_g: 3.6,
    carbohydrates_g: 14.5,
    fat_g: 11.0,
    fiber_g: 1.8,
    sugar_g: 0.5,
    sodium_mg: 220,
  },
  {
    barcode: '8901262010014',
    brand: 'Amul',
    productName: 'Taaza Homogenised Toned Milk',
    flavor: 'Plain',
    packageSize: '1L',
    servingSize: '200ml',
    calories: 116,
    protein_g: 6.2,
    carbohydrates_g: 9.4,
    fat_g: 6.0,
    fiber_g: 0,
    sugar_g: 9.4,
    sodium_mg: 100,
  },
  {
    barcode: '8901063012015',
    brand: 'Britannia',
    productName: '100% Whole Wheat Bread',
    flavor: 'Whole Wheat',
    packageSize: '400g',
    servingSize: '2 slices (50g)',
    calories: 125,
    protein_g: 4.8,
    carbohydrates_g: 24.0,
    fat_g: 1.2,
    fiber_g: 3.5,
    sugar_g: 2.0,
    sodium_mg: 210,
  },
  {
    barcode: '8901491001014',
    brand: "Haldiram's",
    productName: 'Aloo Bhujia',
    flavor: 'Spicy Potato Sev',
    packageSize: '200g',
    servingSize: '30g',
    calories: 175,
    protein_g: 2.8,
    carbohydrates_g: 13.5,
    fat_g: 12.0,
    fiber_g: 1.2,
    sugar_g: 0.5,
    sodium_mg: 240,
  },
];

/**
 * Look up packaged product by barcode (optional workflow).
 */
export const lookupProductByBarcode = async (barcode) => {
  if (!barcode || typeof barcode !== 'string') return null;
  const cleanBarcode = barcode.trim();

  // 1. Check local catalog
  const localMatch = PACKAGED_PRODUCTS_DATABASE.find(p => p.barcode === cleanBarcode);
  if (localMatch) {
    return {
      found: true,
      source: 'packaged_database',
      product: localMatch,
    };
  }

  // 2. OpenFoodFacts fallback (optional network lookup)
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`, {
      headers: { 'User-Agent': 'VitaCare-HealthApp/1.0' },
      signal: AbortSignal.timeout(3000), // Fast 3-second timeout
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const nut = p.nutriments || {};
        return {
          found: true,
          source: 'open_food_facts',
          product: {
            barcode: cleanBarcode,
            brand: p.brands || 'Packaged Brand',
            productName: p.product_name || 'Packaged Food',
            servingSize: p.serving_size || '100g',
            calories: Math.round(nut['energy-kcal_serving'] || nut['energy-kcal_100g'] || 0),
            protein_g: Math.round((nut['proteins_serving'] || nut['proteins_100g'] || 0) * 10) / 10,
            carbohydrates_g: Math.round((nut['carbohydrates_serving'] || nut['carbohydrates_100g'] || 0) * 10) / 10,
            fat_g: Math.round((nut['fat_serving'] || nut['fat_100g'] || 0) * 10) / 10,
            fiber_g: Math.round((nut['fiber_serving'] || nut['fiber_100g'] || 0) * 10) / 10,
            sugar_g: Math.round((nut['sugars_serving'] || nut['sugars_100g'] || 0) * 10) / 10,
            sodium_mg: Math.round((nut['sodium_serving'] || nut['sodium_100g'] || 0) * 1000),
          },
        };
      }
    }
  } catch (err) {
    // Network lookup failure is non-blocking
  }

  return null;
};

/**
 * Identify packaged food from visual hints or brand text.
 */
export const matchPackagedProductFromText = (text = '') => {
  const q = text.toLowerCase();

  for (const item of PACKAGED_PRODUCTS_DATABASE) {
    const nameMatch = q.includes(item.productName.toLowerCase());
    const brandMatch = q.includes(item.brand.toLowerCase());
    if (nameMatch || (brandMatch && item.flavor && q.includes(item.flavor.toLowerCase()))) {
      return item;
    }
  }

  // Check generic packaged snacks like Boondi / Bonde
  if (q.includes('boondi') || q.includes('bonde') || q.includes('kara boondi')) {
    return PACKAGED_PRODUCTS_DATABASE[0]; // Haldiram's Boondi default
  }

  return null;
};
