import type { Brand, Category, Product } from "./holistic-catalog-types";

// Generated from live sbmholisticfarmacy.com product pages.
// Run `node scripts/generate-holistic-catalog.mjs` to refresh.

export const HOLISTIC_BRANDS: Brand[] = [
  {
    "id": "brand_sbm_holistic_farmacy",
    "name": "SBM Holistic Farmacy",
    "slug": "sbm-holistic-farmacy",
    "blurb": "Healing with plant and holistic lifestyle."
  }
];

export const HOLISTIC_CATEGORIES: Category[] = [
  {
    "id": "cat_gut_digestion",
    "name": "Gut & digestion",
    "slug": "gut-digestion",
    "blurb": "Digestive support, soothing teas, enzymes, and gut-first formulas for daily balance.",
    "image": "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0223.jpeg",
    "productCount": 8
  },
  {
    "id": "cat_womens_health",
    "name": "Women's health",
    "slug": "womens-health",
    "blurb": "Cycle care, fertility support, intimate wellness, and womb-focused herbal routines.",
    "image": "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/PHOTO-2021-06-03-22-26-19.jpg",
    "productCount": 12
  },
  {
    "id": "cat_mens_wellness",
    "name": "Men's wellness",
    "slug": "mens-wellness",
    "blurb": "Performance, stamina, reproductive support, and restorative herbal nutrition for men.",
    "image": "https://sbmholisticfarmacy.com/wp-content/uploads/2025/07/ChatGPT-Image-Jul-7-2025-05_03_35-PM.png",
    "productCount": 6
  },
  {
    "id": "cat_detox_cleanses",
    "name": "Detox & cleanses",
    "slug": "detox-cleanses",
    "blurb": "Targeted cleanse kits and reset blends for liver, colon, lungs, and whole-body renewal.",
    "image": "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/ChatGPT-Image-Nov-11-2025-01_37_59-PM.png",
    "productCount": 7
  },
  {
    "id": "cat_immunity_relief",
    "name": "Immunity & relief",
    "slug": "immunity-relief",
    "blurb": "Plant-based relief for seasonal stress, breathing support, comfort, and recovery.",
    "image": "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0610.png",
    "productCount": 8
  },
  {
    "id": "cat_superfoods_wellness",
    "name": "Superfoods & daily wellness",
    "slug": "superfoods-wellness",
    "blurb": "Mushroom blends, powders, and everyday wellness staples that nourish from within.",
    "image": "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-1.13.07-PM.jpeg",
    "productCount": 9
  }
];

export const HOLISTIC_PRODUCTS: Product[] = [
  {
    "id": "hf_001",
    "name": "Alkaline gut super food",
    "slug": "alkaline-gut-super-food",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 60000,
    "rating": 4.6,
    "reviewCount": 12,
    "description": "Alkaline Superfood - Restore Balance, Renew Vitality Support your body's natural pH and nourish it from the inside out with our Alkaline Superfood a nutrient-dense blend of powerful greens and herbs designed to detoxify, energize, and rebalance. Formulated with a rich combination of chlorophyll-rich plants, alkalizing minerals, and antioxidants, this superfood blend helps neutralize acidity in the body, improve digestion, and boost overall wellness.",
    "benefits": [
      "Balances Body pH",
      "Helps combat acidity and maintain a healthy internal environment",
      "Rich in Chlorophyll & Nutrients",
      "A potent source of vitamins, minerals, and enzymes from nature's finest green plants",
      "Supports Natural Detoxification"
    ],
    "ingredients": [
      "a rich combination of chlorophyll-rich plants",
      "alkalizing minerals",
      "antioxidants",
      "improve digestion",
      "boost overall wellness"
    ],
    "howToUse": [
      "Mix 1 teaspoon in water, juice, or smoothies",
      "Stir into your morning herbal tea",
      "Take daily for ongoing support or as part of a detox program Alkaline Superfood by SBM Holistic Farmacy is your go-to daily green elixir, ideal for those seeking natural energy, pH balance, and vibrant wellness the holistic way."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0223.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0223.jpeg"
    ],
    "availableStock": 7,
    "reservedStock": 0,
    "soldStock": 324,
    "damagedStock": 1,
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Energy",
      "Skin recovery"
    ],
    "tags": [
      "Herbal blends",
      "Herbs",
      "Acid reflux",
      "Colon",
      "Gastritis",
      "GERD",
      "Holistic",
      "Organic"
    ],
    "reviews": []
  },
  {
    "id": "hf_002",
    "name": "Digestive enzyme",
    "slug": "digestive-enzyme",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 35300,
    "rating": 4.7,
    "reviewCount": 15,
    "description": "Digestive Enzyme Support Your Gut. Enhance Nutrient Absorption.",
    "benefits": [
      "Enhances Digestion",
      "Breaks down proteins, fats, and carbohydrates for easier absorption",
      "Reduces Bloating & Gas",
      "Helps ease discomfort after meals and supports smoother digestion",
      "Boosts Nutrient Absorption"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use daily or as advised by your wellness guide or health expert",
      "Why Choose Our Digestive Enzyme? 100% natural plant-based enzymes No fillers, preservatives, or artificial additives Carefully formulated and tested for quality Gentle on the stomach, powerful in action Good digestion is the root of good health",
      "Let your gut thank you",
      "Consult your healthcare provider before starting any new supplement, especially if pregnant, breastfeeding, or on medication."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0605-1.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0605-1.png"
    ],
    "availableStock": 2,
    "reservedStock": 1,
    "soldStock": 318,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Energy"
    ],
    "tags": [
      "Capsules",
      "Herbal blends",
      "Herbal supplements",
      "Herbs"
    ],
    "reviews": []
  },
  {
    "id": "hf_003",
    "name": "Stomach healing tea",
    "slug": "stomach-healing-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 20300,
    "rating": 4.8,
    "reviewCount": 18,
    "description": "Stomach Healing Tea - Gentle Relief, Natural Support Soothe your digestive system with Stomach Healing Tea, a carefully crafted herbal blend designed to calm discomfort and restore balance from within. Perfect for those dealing with bloating, indigestion, or sensitive stomachs, this tea offers a natural way to keep your gut happy and healthy.",
    "benefits": [
      "Relieves Indigestion & Bloating",
      "Eases gas, cramping, and stomach heaviness after meals",
      "Supports Gut Healing",
      "Helps calm irritation and promotes digestive tract comfort",
      "Reduces Acidity & Heartburn"
    ],
    "ingredients": [
      "Gastritis",
      "Gastrointestinal issues",
      "GERD",
      "Gut",
      "Gut health",
      "Healing"
    ],
    "howToUse": [
      ":Steep one tea bag (or a teaspoon of loose blend) in hot water for 3-5 minutes",
      "Enjoy warm, preferably after meals or when stomach discomfort arises",
      "Perfect For:Anyone looking for a natural, soothing remedy for digestive troubles, bloating, acidity, or general gut discomfort."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0262.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0262.png"
    ],
    "availableStock": 1,
    "reservedStock": 2,
    "soldStock": 312,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Stress relief"
    ],
    "tags": [
      "Herbs",
      "Gastritis",
      "Gastrointestinal issues",
      "GERD",
      "Gut",
      "Gut health",
      "Healing",
      "Organic"
    ],
    "reviews": []
  },
  {
    "id": "hf_004",
    "name": "Gut health tea",
    "slug": "gut-health-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 20000,
    "rating": 4.9,
    "reviewCount": 21,
    "description": "Bring comfort back to your gut with our soothing Gut Health Tea, a natural herbal blend designed to heal, cleanse, and restore balance from within. Whether you're dealing with occasional digestive discomfort or long-term gut concerns, this tea provides calming relief while supporting overall digestive wellness.",
    "benefits": [
      "of Gut Health Tea Helps Heal Leaky Gut",
      "Supports repair and strengthening of the gut lining for better digestion",
      "Soothes Digestive Disorders",
      "Aids healing from gastritis, acid reflux, GERD, and ulcers",
      "Cleanses the Colon"
    ],
    "ingredients": [
      "Acid reflux",
      "Colon",
      "Gastritis",
      "GERD",
      "Gut tea",
      "Herbs"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0419-1.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0419-1.png"
    ],
    "availableStock": 1,
    "reservedStock": 3,
    "soldStock": 306,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Energy"
    ],
    "tags": [
      "Herbal blends",
      "Herbs",
      "Acid reflux",
      "Colon",
      "Gastritis",
      "GERD",
      "Gut tea",
      "Ulcer"
    ],
    "reviews": []
  },
  {
    "id": "hf_005",
    "name": "Gut healing oil",
    "slug": "gut-healing-oil",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 15500,
    "rating": 4.6,
    "reviewCount": 24,
    "description": "Soothe, Repair & Restore from the Inside Out Your gut is the core of your well-being - when it's calm and healthy, your whole body feels the difference. SBM Gut Healing Oil is a carefully blended natural formula designed to soothe digestive distress, heal the gut lining, and restore balance from within.",
    "benefits": [
      "Relieves Acid Reflux Naturally",
      "Calms burning sensations and discomfort caused by acid reflux, promoting smoother digestion",
      "Supports Healing for Gastritis, Ulcers & GERDHelps repair irritated or damaged stomach and esophageal tissues, offering gentle but effective relief",
      "Promotes Gut Lining Repair",
      "Delivers nutrients that strengthen and restore the intestinal wall, ideal for those with leaky gut or chronic irritation"
    ],
    "ingredients": [
      "out synthetic chemicals for safe",
      "consistent use in your wellness routine"
    ],
    "howToUse": [
      "Internal",
      "Take orally in the dosage recommended by your wellness practitioner",
      "External",
      "Massage gently over the abdominal area in circular motions"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG-4500-1.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG-4500-1.png"
    ],
    "availableStock": 40,
    "reservedStock": 0,
    "soldStock": 300,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Stress relief"
    ],
    "tags": [
      "Aroma Healing",
      "Herbs",
      "Acid reflux",
      "Gastritis",
      "GERD",
      "Gut health",
      "Herbal oil",
      "Ulcer"
    ],
    "reviews": []
  },
  {
    "id": "hf_006",
    "name": "Acid reflux block drop",
    "slug": "acid-reflux-block-drop",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 25500,
    "rating": 4.7,
    "reviewCount": 27,
    "description": "This is made with ginger and licorice extract How it works for acid reflux , heart burn and indigestion. Ginger is rich in chemicals and antioxidants, such as phenolic compounds. These may provide health",
    "benefits": [
      ", such as reducing inflammation associated with acid reflux",
      "Plus, ginger's anti-inflammatory properties may help reduce the production of stomach acid",
      "This may help relieve symptoms of mild acid reflux",
      "Ginger is an alkaline food",
      "Licorice"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/WhatsApp-Image-2025-08-20-at-2.14.10-PM.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/WhatsApp-Image-2025-08-20-at-2.14.10-PM.jpeg"
    ],
    "availableStock": 25,
    "reservedStock": 1,
    "soldStock": 294,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion"
    ],
    "tags": [
      "Medicinal oil"
    ],
    "reviews": []
  },
  {
    "id": "hf_007",
    "name": "Slippery Elm Bark X Marshmallow Root capsule",
    "slug": "slippery-elm-bark-x-marshmallow-root",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 35500,
    "rating": 4.8,
    "reviewCount": 30,
    "description": "Slippery Elm Bark X Marshmallow Root",
    "benefits": [
      "Help treat certain digestive disorders Helps treat leaky gut syndrome",
      "It helps in healing salves for wounds Treats boils Treats ulcers Helps treat skin inflammation Helps relieve coughs, sore throat Helps treat diarrhea and stomach problem"
    ],
    "ingredients": [
      "Acid reflux",
      "Burns",
      "Digestive disorder",
      "Esophagitis",
      "Esophagus",
      "Gastritis"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0586.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0586.png"
    ],
    "availableStock": 22,
    "reservedStock": 2,
    "soldStock": 288,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Immunity"
    ],
    "tags": [
      "Capsules",
      "Herbs",
      "Acid reflux",
      "Burns",
      "Digestive disorder",
      "Esophagitis",
      "Esophagus",
      "Gastritis"
    ],
    "reviews": []
  },
  {
    "id": "hf_008",
    "name": "Dandelion root powder",
    "slug": "dandelion-leaf-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "gut-digestion",
    "retailPrice": 17800,
    "rating": 5,
    "reviewCount": 1,
    "description": "At SBM Holistic Farmacy, we believe true healing begins with cleansing, nourishing, and rebalancing the body from within. One of our most trusted herbal allies for this is the Dandelion Root, a humble plant with a powerful history in natural medicine.",
    "benefits": [
      "of Dandelion Root Powder Supports Healthy Digestion & Gut Balance Rich in inulin, a natural prebiotic fibre, dandelion root feeds good gut bacteria, supports smoother digestion, reduces bloating, and encourages regular bowel movements",
      "Gentle Detox & Liver Cleanse Stimulates bile production, helping the body process fats and flush toxins more efficiently",
      "This promotes skin clarity, balanced energy, and an overall sense of lightness",
      "Fluid Balance & Kidney Support Its gentle diuretic properties help release excess water and reduce puffiness-without depleting potassium, unlike many synthetic diuretics",
      "Heart & Circulation Health Naturally rich in potassium and magnesium, dandelion root supports healthy blood pressure, regulates heart rhythm, and improves circulation"
    ],
    "ingredients": [
      "Blood pressure",
      "Blood sugar",
      "Period cleansing",
      "Uterine health"
    ],
    "howToUse": [
      "Tea / Infusion",
      "Steep 1-2 teaspoons in hot water or blend with other herbs",
      "Smoothie",
      "Mix into your morning smoothie for a cleansing boost"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2023/11/ChatGPT-Image-May-22-2025-11_29_58-AM.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2023/11/ChatGPT-Image-May-22-2025-11_29_58-AM.png"
    ],
    "availableStock": 7,
    "reservedStock": 3,
    "soldStock": 282,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Energy"
    ],
    "tags": [
      "Herbs",
      "Blood pressure",
      "Blood sugar",
      "Period cleansing",
      "Uterine health"
    ],
    "reviews": [
      {
        "id": "https___sbmholisticfarmacy_com_product_dandelion-leaf-tea__li-comment-60870",
        "author": "Esther Kenny",
        "rating": 5,
        "title": "Customer review 1",
        "body": "Best product",
        "createdAt": "2026-01-01"
      }
    ]
  },
  {
    "id": "hf_009",
    "name": "Beautiful menses Regular",
    "slug": "beautiful-menses-regular",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 9720,
    "rating": 5,
    "reviewCount": 2,
    "description": "Natural Hormonal Balance & Cycle Support Beautiful Menses Regular is a carefully formulated herbal blend designed to support menstrual cycle regularity, hormonal balance, and overall reproductive wellness. Rooted in traditional herbal wisdom and modern holistic care, this formula works gently with your body to promote a healthy, comfortable, and predictable cycle.",
    "benefits": [
      "Regulates Menstrual Cycle Helps balance hormones naturally to encourage a consistent and timely cycle",
      "Reduces PMS Discomfort May ease cramps, bloating, mood swings, and irritability before and during menstruation",
      "Supports Uterine Health Nourishes and tones the uterus, supporting its optimal function and long-term wellness",
      "Balances Hormones Supports healthy estrogen and progesterone levels, which may help reduce irregular bleeding and cycle imbalances",
      "Encourages Smooth Menstrual Flow Helps reduce clotting and encourages healthy blood circulation in the reproductive area"
    ],
    "ingredients": [
      "traditional herbal wisdom",
      "modern holistic care",
      "comfortable",
      "predictable cycle",
      "nutrient-rich",
      "hormone-supporting botanicals"
    ],
    "howToUse": [
      "Take as directed on the product label or as advised by your herbal practitioner",
      "For best results, use consistently for at least 3 consecutive cycles."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/PHOTO-2021-06-03-22-26-19.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/PHOTO-2021-06-03-22-26-19.jpg"
    ],
    "availableStock": 19,
    "reservedStock": 0,
    "soldStock": 276,
    "damagedStock": 0,
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Energy"
    ],
    "tags": [
      "FEMININECARE",
      "Fertility",
      "Bad bacteria",
      "PH balance",
      "Vagina cleanser",
      "Vagina odor"
    ],
    "reviews": [
      {
        "id": "https___sbmholisticfarmacy_com_product_beautiful-menses-regular__li-comment-64987",
        "author": "Ayotomilola",
        "rating": 5,
        "title": "Customer review 1",
        "body": "I love the packaging and feeling",
        "createdAt": "2026-03-27"
      },
      {
        "id": "https___sbmholisticfarmacy_com_product_beautiful-menses-regular__li-comment-59732",
        "author": "Philomena Oloye",
        "rating": 5,
        "title": "Customer review 2",
        "body": "Very good product, stops itching, foul discharge",
        "createdAt": "2025-12-14"
      }
    ]
  },
  {
    "id": "hf_010",
    "name": "Beautiful menses (Advance) 50ml",
    "slug": "beautiful-menses-advance",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 15120,
    "rating": 5,
    "reviewCount": 1,
    "description": "Beautiful menses (Advance)",
    "benefits": [
      "It helps relieve menstual pain Treats vagina infection Eliminates bad odour Good for infertility Helps shrink fibroid Uterine cleansing"
    ],
    "ingredients": [
      "Bad odor",
      "Fibroid shrinkage",
      "Infertility",
      "Menstual pain",
      "Uterine cleansing",
      "Vagina infection"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0449-2.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0449-2.png"
    ],
    "availableStock": 19,
    "reservedStock": 1,
    "soldStock": 270,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": true,
    "skinConcern": [
      "Menstrual support",
      "Immunity"
    ],
    "tags": [
      "FEMININECARE",
      "Bad odor",
      "Fibroid shrinkage",
      "Infertility",
      "Menstual pain",
      "Uterine cleansing",
      "Vagina infection"
    ],
    "reviews": [
      {
        "id": "https___sbmholisticfarmacy_com_product_beautiful-menses-advance__li-comment-67610",
        "author": "Jumoke",
        "rating": 5,
        "title": "Customer review 1",
        "body": "I like the smell",
        "createdAt": "2026-05-11"
      }
    ]
  },
  {
    "id": "hf_011",
    "name": "Holy Yoni Oil",
    "slug": "holy-yoni-oil",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 8600,
    "rating": 4.8,
    "reviewCount": 23,
    "description": "Pure Herbal Nourishment for Feminine Wellness Holy Yoni Oil is a luxurious blend of natural, skin-loving botanicals designed to nourish, protect, and restore intimate feminine areas. Rooted in ancient herbal traditions, it supports vaginal health, comfort, and confidence by combining deep moisturization, soothing relief, and natural cleansing properties.",
    "benefits": [
      "Promotes Vaginal Freshness & Comfort",
      "Maintains a balanced intimate environment, leaving you fresh and confident",
      "Natural Moisturization",
      "Deeply hydrates delicate skin, relieving dryness and discomfort",
      "Supports Healthy pH Balance"
    ],
    "ingredients": [
      "ancient herbal traditions",
      "it supports vaginal health",
      "comfort",
      "confidence by combining deep moisturization",
      "soothing relief",
      "natural cleansing properties"
    ],
    "howToUse": [
      "Apply a few drops externally to the vaginal area after bathing or as part of your self-care routine",
      "For external use only unless otherwise directed by a qualified herbal practitioner",
      "Disclaimer SBM Holy Yoni Oil is intended for external feminine care and is not a medical treatment",
      "It does not diagnose, treat, cure, or prevent any disease"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0593-1.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0593-1.png"
    ],
    "availableStock": 12,
    "reservedStock": 2,
    "soldStock": 264,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Skin recovery"
    ],
    "tags": [
      "Balance Ph",
      "FEMININE WELLNESS",
      "Vagina detox",
      "Vagina itching",
      "Vagina tear"
    ],
    "reviews": []
  },
  {
    "id": "hf_012",
    "name": "Vee Protect",
    "slug": "vee-protect",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 5508,
    "rating": 4.9,
    "reviewCount": 26,
    "description": "Your Daily Shield for Feminine Wellness Feminine health is delicate, and it deserves daily protection that's both gentle and effective. SBM Vee Protect is a carefully crafted, plant-based formula designed to help maintain intimate freshness, support pH balance, fight potential infections, and guard against discomfort - all while being kind to sensitive skin.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "tea tree oil",
      "neem extract",
      "known for their natural antimicrobial",
      "antifungal properties",
      "Vee Protect helps guard against bacteria",
      "yeast that can cause discomfort or imbalance"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/WhatsApp-Image-2025-05-30-at-9.39.31-AM.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/WhatsApp-Image-2025-05-30-at-9.39.31-AM.jpeg"
    ],
    "availableStock": 32,
    "reservedStock": 3,
    "soldStock": 258,
    "damagedStock": 1,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Skin recovery"
    ],
    "tags": [
      "FEMININECARE",
      "Kill germs",
      "Protect from infection",
      "Stops foul smell"
    ],
    "reviews": []
  },
  {
    "id": "hf_013",
    "name": "Vee Balm",
    "slug": "vee-balm",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 7560,
    "rating": 4.6,
    "reviewCount": 29,
    "description": "Soothe, Smooth & Say Goodbye to Bumps! Your most delicate areas deserve gentle, loving care - free from harsh chemicals.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "Underarm bumps",
      "Vulva area bumps"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/vee-balm.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/vee-balm-595x793.jpeg"
    ],
    "availableStock": 35,
    "reservedStock": 0,
    "soldStock": 252,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Skin recovery"
    ],
    "tags": [
      "Balms",
      "FEMININECARE",
      "Underarm bumps",
      "Vulva area bumps"
    ],
    "reviews": []
  },
  {
    "id": "hf_014",
    "name": "Vee Mist",
    "slug": "vee-mist",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 13500,
    "rating": 4.7,
    "reviewCount": 13,
    "description": "SBM Feminine Care: Vee Mist A Natural and Soothing Vaginal Care Mist Our Vee Mist is a carefully crafted blend of natural hydrosols, designed to promote vaginal health, comfort, and confidence. Key Ingredients: 1.",
    "benefits": [
      "Soothes and calms the vaginal area",
      "Maintains a healthy vaginal flora",
      "Reduces inflammation and irritation",
      "Promotes confidence and well-being."
    ],
    "ingredients": [
      "Bad bacteria ph balance vagina cleanser vagina odor"
    ],
    "howToUse": [
      "Shake the bottle well before each use",
      "Spray the mist onto the vaginal area, holding the bottle 6-8 inches away",
      "Use as needed, up to 3-4 times a day",
      "Disclaimer:"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/ChatGPT-Image-Aug-28-2025-04_14_03-PM.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/ChatGPT-Image-Aug-28-2025-04_14_03-PM.png"
    ],
    "availableStock": 15,
    "reservedStock": 1,
    "soldStock": 246,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Skin recovery"
    ],
    "tags": [
      "FEMININECARE",
      "Bad bacteria ph balance vagina cleanser vagina odor"
    ],
    "reviews": []
  },
  {
    "id": "hf_015",
    "name": "Happy period tea",
    "slug": "happy-period-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 21924,
    "rating": 4.8,
    "reviewCount": 16,
    "description": "*Happy period tea * Natural Solutions for Menstrual and Reproductive Health Are you tired of experiencing debilitating menstrual cramps, bloating, and mood swings? Do you struggle with infertility or reproductive issues?",
    "benefits": [
      "Relieves menstrual cramps and PMS symptoms",
      "Regulates menstrual cycles and hormone balance",
      "Reduces bloating and water retention",
      "Supports liver function and overall health Reproductive Health Benefits:",
      "Enhances fertility and reproductive health"
    ],
    "ingredients": [
      "Happy period tea",
      "Irregular period",
      "Painful period",
      "Uterus cleanse"
    ],
    "howToUse": [
      "These Ingredients:",
      "Steep 1 of dried tea and in boiling water for 5-10 minutes Combination Therapies:",
      "Dandelion + Fennel",
      "Enhances hormone balance and menstrual regularity"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/PHOTO-2021-04-08-17-05-22-2.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/PHOTO-2021-04-08-17-05-22-2.jpg"
    ],
    "availableStock": 15,
    "reservedStock": 2,
    "soldStock": 240,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Stress relief"
    ],
    "tags": [
      "Herbs",
      "Happy period tea",
      "Irregular period",
      "Painful period",
      "Uterus cleanse"
    ],
    "reviews": []
  },
  {
    "id": "hf_016",
    "name": "Myo inositol capsule",
    "slug": "myo-inositol-capsule",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 35000,
    "rating": 4.9,
    "reviewCount": 19,
    "description": "",
    "benefits": [
      "of Myo inositol Helps control the menstrual cycle Stimulates the growth of eggs in the ovaries Might balance certail chemicals in the body to help with mental conditions such as panic disorder, depression, and obsessive-compulsive disorder"
    ],
    "ingredients": [
      "Chemical balance",
      "Depression",
      "Egg health",
      "Hormonal balance",
      "Menstrual cycle",
      "Myo inositol"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0401.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0401.png"
    ],
    "availableStock": 27,
    "reservedStock": 3,
    "soldStock": 234,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Energy"
    ],
    "tags": [
      "Capsules",
      "Herbal supplements",
      "Herbs",
      "Chemical balance",
      "Depression",
      "Egg health",
      "Hormonal balance",
      "Menstrual cycle"
    ],
    "reviews": []
  },
  {
    "id": "hf_017",
    "name": "Wild yam extract (30ml)",
    "slug": "wild-yam-extract-30ml",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 20500,
    "rating": 4.6,
    "reviewCount": 22,
    "description": "Discorea Villosa Helps To Relieve Colic And Menstrual Pain Used As A Natural Alternative For Estrogen Replacement Therapy Wild Yam Roots Are Wildcrafted. Easy To Use & Absorb Liquid Tincture Gluten-Free Menopause : May alleviate menopausal symptoms Wild yam may be advantageous to menopausal women due to its potential to have an estrogen-like impact on the body.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "Egg health",
      "Essential oil",
      "Fertility",
      "Hormonal balance",
      "Medicinal oil",
      "Menopause."
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/08/ChatGPT-Image-Sep-19-2025-01_04_35-PM.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/08/ChatGPT-Image-Sep-19-2025-01_04_35-PM.png"
    ],
    "availableStock": 12,
    "reservedStock": 0,
    "soldStock": 228,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Stress relief"
    ],
    "tags": [
      "Medicinal oil",
      "Egg health",
      "Essential oil",
      "Fertility",
      "Hormonal balance",
      "Menopause.",
      "Period",
      "Vitex oil"
    ],
    "reviews": []
  },
  {
    "id": "hf_018",
    "name": "Vitex capsule",
    "slug": "vitex-capsule",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 30500,
    "rating": 4.7,
    "reviewCount": 25,
    "description": "Vitex agnus-castus, also known as chasteberry, is a plant that has been used for centuries to support women's health and hormonal balance. Here are some of the specific and general health",
    "benefits": [
      "of Vitex",
      "Relieves PMS Symptoms",
      "Vitex has been shown to reduce symptoms of premenstrual syndrome (PMS), including breast tenderness, mood swings, and bloating",
      "Regulates Menstrual Cycles",
      "Vitex may help regulate menstrual cycles, reducing the risk of irregular periods, amenorrhea, and dysmenorrhea"
    ],
    "ingredients": [
      "reduce the risk of chronic diseases"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0573.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0573.png"
    ],
    "availableStock": 6,
    "reservedStock": 1,
    "soldStock": 222,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Energy"
    ],
    "tags": [
      "Capsules",
      "Herbs",
      "Conception",
      "Fertile mucus",
      "Fertility",
      "Hormonal imbalance",
      "Hormones",
      "Menses"
    ],
    "reviews": []
  },
  {
    "id": "hf_019",
    "name": "Fertile Boost Tea",
    "slug": "fertile-boost-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 27200,
    "rating": 4.8,
    "reviewCount": 28,
    "description": "NOURISH YOUR BODY, SUPPORT YOUR FERTILITY NATURALLY. Designed for women on their fertility journey, SBM Fertile Boost Tea is a premium herbal blend formulated to support hormonal balance, improve reproductive health, and prepare the body for conception - naturally and holistically.",
    "benefits": [
      "Promotes hormonal balance and cycle regulation",
      "Supports ovarian and uterine health",
      "Enhances natural fertility and ovulation",
      "Reduces stress and supports emotional well-being100% natural, caffeine-free, and gentle on the body Ideal For",
      "Women trying to conceive naturally Those with irregular cycles or hormonal imbalances Women preparing for fertility treatments Anyone seeking a natural boost to reproductive wellness"
    ],
    "ingredients": [
      "improve ovulation",
      "boost reproductive vitality"
    ],
    "howToUse": [
      "Steep 1 teaspoon of Fertile Boost Tea in hot water for 5-7 minutes",
      "Drink 1-2 cups daily, preferably starting from the first day after menstruation up to ovulation (or as advised by a holistic therapist)",
      "For best results, pair with a fertility-friendly diet and lifestyle",
      "Disclaimer Fertile Boost Tea is a natural herbal blend formulated to support overall reproductive wellness"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/34.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/34.png"
    ],
    "availableStock": 44,
    "reservedStock": 2,
    "soldStock": 216,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Energy"
    ],
    "tags": [
      "Herbal blends",
      "Herbs",
      "Adhesion. fibroids",
      "Blocked tubes",
      "Conception",
      "Endometriosis",
      "Enzymes superfood",
      "Fertility"
    ],
    "reviews": []
  },
  {
    "id": "hf_020",
    "name": "Fertility massage oil",
    "slug": "fertility-massage-oil",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "womens-health",
    "retailPrice": 20500,
    "rating": 4,
    "reviewCount": 1,
    "description": "Crafted with a blend of carefully selected natural oils, Fertility Massage Oil is designed to support reproductive health and promote relaxation through gentle massage. This soothing oil encourages circulation to the abdominal area, helping to create a balanced environment for fertility and overall wellness.",
    "benefits": [
      "Supports Reproductive Health",
      "Nourishes and tones the reproductive organs through targeted massage",
      "Promotes Hormonal Balance",
      "Helps the body maintain natural rhythm and balance",
      "Improves Circulation"
    ],
    "ingredients": [
      "a blend of carefully selected natural oils",
      "promote relaxation through gentle massage"
    ],
    "howToUse": [
      ":Warm a small amount in your hands and massage gently into the lower abdomen, hips, and lower back in circular motions",
      "Use consistently as part of a fertility wellness routine",
      "Perfect For:Women looking for a natural, holistic aid to support fertility, reproductive balance, and relaxation in their wellness journey."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0439.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0439.png"
    ],
    "availableStock": 5,
    "reservedStock": 3,
    "soldStock": 210,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Menstrual support",
      "Stress relief"
    ],
    "tags": [
      "Aroma Healing",
      "Herbs",
      "Adhesion",
      "Fertility massage oil",
      "Fibroid shrinkage",
      "Reproduction",
      "Scarring",
      "Uterus cleaning"
    ],
    "reviews": [
      {
        "id": "https___sbmholisticfarmacy_com_product_fertility-massage-oil__li-comment-67609",
        "author": "Jumoke",
        "rating": 4,
        "title": "Customer review 1",
        "body": "Product is good",
        "createdAt": "2026-05-11"
      }
    ]
  },
  {
    "id": "hf_021",
    "name": "Men's Sexual Health",
    "slug": "mens-fertility-support-kit",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "mens-wellness",
    "retailPrice": 105800,
    "rating": 3,
    "reviewCount": 1,
    "description": "Natural Vitality | Hormonal Balance | Reproductive Health Support your reproductive health and overall vitality with our Men's Fertility Kit, a powerful trio of time-tested herbal supplements designed to naturally enhance male performance, stamina, and fertility. Each kit includes: Korean Ginseng Root - Renowned for its energy-boosting and stress-reducing properties, ginseng supports overall stamina, immune health, and sexual function.",
    "benefits": [
      "Boosts natural testosterone production Supports improved sperm health and fertility Enhances libido and sexual performance Reduces fatigue and stress levels 100% natural and safe with no synthetic additives"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/07/ChatGPT-Image-Jul-7-2025-05_03_35-PM.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/07/ChatGPT-Image-Jul-7-2025-05_03_35-PM.png"
    ],
    "availableStock": 9,
    "reservedStock": 0,
    "soldStock": 204,
    "damagedStock": 0,
    "isFeatured": true,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Fertility",
      "Health kit",
      "Herbal blends",
      "Herbal supplements",
      "Men"
    ],
    "reviews": [
      {
        "id": "https___sbmholisticfarmacy_com_product_mens-fertility-support-kit__li-comment-51297",
        "author": "Abdul sam",
        "rating": 3,
        "title": "Customer review 1",
        "body": "it was nice",
        "createdAt": "2025-08-12"
      }
    ]
  },
  {
    "id": "hf_022",
    "name": "Men's Fertility & Reproductive kit",
    "slug": "mens-fertility-reproductive-kit",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "mens-wellness",
    "retailPrice": 176300,
    "rating": 4.7,
    "reviewCount": 18,
    "description": "Ashwagandha : Apart from women, consumption of Ashwagandha is considered very beneficial to remove infertility in men as well. Consuming Ashwagandha improves the level of testosterone hormone in the body and this increases your fertility.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "phytoestrogens"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0481.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0481.png"
    ],
    "availableStock": 10,
    "reservedStock": 1,
    "soldStock": 198,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Capsules",
      "Fertility",
      "Health kit",
      "Herbs",
      "Men",
      "Azoospermia",
      "Erectile dysfunction",
      "Low sperm count"
    ],
    "reviews": []
  },
  {
    "id": "hf_023",
    "name": "Tongkat Ali capsule",
    "slug": "tongkat-ali-capsule",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "mens-wellness",
    "retailPrice": 35300,
    "rating": 4.8,
    "reviewCount": 21,
    "description": "Tongkat Ali (Eurycoma longifolia)",
    "benefits": [
      "Sexual Health Benefits",
      "Enhances libido and sexual desire 2",
      "Improves erectile function and potency 3",
      "Increases sperm count and motility 4",
      "Supports testosterone production 5"
    ],
    "ingredients": [
      "Erectile dysfunction",
      "Hormonal health",
      "Libido",
      "Sperm health",
      "Stamina",
      "Tongkat ali"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0408.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0408.png"
    ],
    "availableStock": 7,
    "reservedStock": 2,
    "soldStock": 192,
    "damagedStock": 1,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy"
    ],
    "tags": [
      "Capsules",
      "Herbal supplements",
      "Herbs",
      "Men",
      "Erectile dysfunction",
      "Hormonal health",
      "Libido",
      "Sperm health"
    ],
    "reviews": []
  },
  {
    "id": "hf_024",
    "name": "Horny goat weed capsule",
    "slug": "horny-goat-weed-capsule",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "mens-wellness",
    "retailPrice": 35000,
    "rating": 4.9,
    "reviewCount": 24,
    "description": "Horny Goat Weed (Epimedium)",
    "benefits": [
      "Sexual Health Benefits",
      "Enhances libido and sexual desire 2",
      "Improves erectile function and potency 3",
      "Increases sperm count and motility 4",
      "Supports testosterone production 5"
    ],
    "ingredients": [
      "Blood flow",
      "Hormone estrogen",
      "Menopause.",
      "Sexual function"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0192-1.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0192-1.jpeg"
    ],
    "availableStock": 29,
    "reservedStock": 3,
    "soldStock": 186,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy"
    ],
    "tags": [
      "Capsules",
      "Herbal supplements",
      "Herbs",
      "Men",
      "Blood flow",
      "Hormone estrogen",
      "Menopause.",
      "Sexual function"
    ],
    "reviews": []
  },
  {
    "id": "hf_025",
    "name": "Saw palmetto",
    "slug": "saw-palmetto",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "mens-wellness",
    "retailPrice": 17000,
    "rating": 4.6,
    "reviewCount": 27,
    "description": "1 Relieves cough 2 Prevents hair loss 3 Aids in digestion 4 Treats infertility 5 Decreases inflammation 6 Treats insomnia 7 Increases sex drive 8 Heals migraines",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "Hair loss",
      "Inflammation",
      "Testosterone",
      "Urinary tract function"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0161.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0161.jpeg"
    ],
    "availableStock": 10,
    "reservedStock": 0,
    "soldStock": 180,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Herbs",
      "Hair loss",
      "Inflammation",
      "Testosterone",
      "Urinary tract function"
    ],
    "reviews": []
  },
  {
    "id": "hf_026",
    "name": "Maca Capsule",
    "slug": "maca-capsule",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "mens-wellness",
    "retailPrice": 30500,
    "rating": 4.7,
    "reviewCount": 30,
    "description": "Natural Energy • Hormonal Balance • Vitality Support Maca Capsule is a premium herbal supplement made from high-quality Maca root, traditionally used for centuries to support energy, stamina, hormonal balance, and overall vitality. Carefully processed and encapsulated for maximum potency, this formula is ideal for both men and women seeking natural wellness support.",
    "benefits": [
      "of Maca Capsule Supports natural energy levels by helping reduce fatigue and improving daily stamina • Supports hormonal balance in both men and women, promoting endocrine wellness • Enhances libido and sexual desire naturally for improved intimate health • Supports male fertility by helping improve sperm quality and motility • Supports female reproductive health by promoting menstrual cycle balance • Helps reduce symptoms associated with PMS and menopause, including mood swings and hot flashes • Supports emotional well-being and mental clarity during periods of stress • Promotes physical endurance and muscle strength for active individuals • Acts as an adaptogen to help the body cope with physical and emotional stress • Supports overall vitality and long-term wellness when used consistently"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/02/image-237.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/02/image-237.jpg"
    ],
    "availableStock": 7,
    "reservedStock": 1,
    "soldStock": 174,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy",
      "Stress relief"
    ],
    "tags": [],
    "reviews": []
  },
  {
    "id": "hf_027",
    "name": "H. Pylori/ Parasite cleanse kit",
    "slug": "parasite-cleanse-kit",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "detox-cleanses",
    "retailPrice": 87500,
    "rating": 4.8,
    "reviewCount": 14,
    "description": "Why we selected this as a kit WORMWOOD : wormwood extract may help support antiparasitic drugs in parts of the world where tapeworms, roundworms, and pinworms are common. Wormwood is used primarily for liver, gall bladder and stomach ailments, as well as to expel intestinal worms, hence the common name.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "including the ones that cause diarrhea"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/IMG-20260425-WA0039.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/IMG-20260425-WA0039.jpg"
    ],
    "availableStock": 14,
    "reservedStock": 2,
    "soldStock": 168,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Immunity"
    ],
    "tags": [
      "Bundle supplements",
      "Health kit",
      "Health tools",
      "Herbs",
      "Infection",
      "Parasite",
      "Parasite cleanse"
    ],
    "reviews": []
  },
  {
    "id": "hf_028",
    "name": "BODY DETOX & WELLNESS KIT",
    "slug": "body-detox-wellness-kit",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "detox-cleanses",
    "retailPrice": 86400,
    "rating": 4.9,
    "reviewCount": 17,
    "description": "Restore balance without harsh regimes. The Body Detox Wellness Kit combines time-tested herbs and modern extracts to support your body's natural cleansing pathways.",
    "benefits": [
      "(user-facing claims, careful & safe) Supports the body's natural cleansing processes and digestive comfort",
      "Provides antioxidant support to help combat everyday oxidative stress",
      "Encourages hydration and a feeling of \"lighter\" energy",
      "Handpicked botanicals that work together for gentle, complementary support",
      "Practical kit for a 7-21 day reset or regular monthly maintenance"
    ],
    "ingredients": [
      "general wellness",
      "fluids",
      "fiber"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/ChatGPT-Image-Nov-11-2025-01_37_59-PM.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/ChatGPT-Image-Nov-11-2025-01_37_59-PM.png"
    ],
    "availableStock": 21,
    "reservedStock": 3,
    "soldStock": 162,
    "damagedStock": 0,
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Body detox",
      "Bundle supplements",
      "Health kit",
      "Herbal supplements"
    ],
    "reviews": []
  },
  {
    "id": "hf_029",
    "name": "Liver Detox kit",
    "slug": "liver-detox-kit-4",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "detox-cleanses",
    "retailPrice": 63700,
    "rating": 4.6,
    "reviewCount": 20,
    "description": "Here's a brief rundown on each ingredient's",
    "benefits": [
      "for liver detox",
      "Black seed oil",
      "Rich in antioxidants, vitamins, and minerals",
      "Supports liver health, reduces inflammation, and promotes cell regeneration",
      "Enhances detoxification processes and protects against oxidative stress 2"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/03/IMG-20260425-WA0007.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/03/IMG-20260425-WA0007.jpg"
    ],
    "availableStock": 5,
    "reservedStock": 0,
    "soldStock": 156,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Energy"
    ],
    "tags": [
      "Uncategorized"
    ],
    "reviews": []
  },
  {
    "id": "hf_030",
    "name": "Heavy Metal Cleanse Kit",
    "slug": "heavy-metal-cleanse-kit",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "detox-cleanses",
    "retailPrice": 67000,
    "rating": 4.7,
    "reviewCount": 23,
    "description": "Advanced Natural Detox & Cellular Protection Support The SBM Holistic Farmacy Heavy Metal Cleanse Kit is a carefully formulated natural detox system designed to support the body's cleansing process and promote overall wellness. This powerful trio combines nutrient-dense superfoods traditionally known for their ability to bind unwanted toxins, support liver function, and protect the body from oxidative stress.",
    "benefits": [
      "Supports the body's natural detox processes May help bind unwanted toxins in the body Rich in chlorophyll for cleansing support High in antioxidants to fight oxidative stress Supports immune health and energy levels Promotes healthy blood and cellular function Spirulina is especially valued for its ability to provide deep nutritional replenishment while supporting natural cleansing pathways",
      "Wheatgrass Powder Alkalizing & Antioxidant Protection Wheatgrass is packed with vitamins A, C, E, iron, magnesium, and powerful antioxidants",
      "It helps nourish the body while supporting internal cleansing and healthy digestion",
      "Key Benefits",
      "High in nutrients and antioxidants Supports healthy liver function Helps maintain balanced blood sugar levels Supports digestive health Promotes healthy circulation Contributes to overall vitality and energy Wheatgrass helps alkalize the body and supports overall internal balance"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/02/IMG-20260426-WA0020.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/02/IMG-20260426-WA0020.jpg"
    ],
    "availableStock": 5,
    "reservedStock": 1,
    "soldStock": 150,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Body detox"
    ],
    "reviews": []
  },
  {
    "id": "hf_031",
    "name": "COLON CLEANSE KIT",
    "slug": "colon-cleanse-kit-3",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "detox-cleanses",
    "retailPrice": 131800,
    "rating": 4.8,
    "reviewCount": 26,
    "description": "Cleanse. Rebalance.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "soothing properties"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/03/file_000000009e2472469158425bfa473e3d.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2026/03/file_000000009e2472469158425bfa473e3d.png"
    ],
    "availableStock": 5,
    "reservedStock": 2,
    "soldStock": 144,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion"
    ],
    "tags": [
      "Health kit",
      "Uncategorized"
    ],
    "reviews": []
  },
  {
    "id": "hf_032",
    "name": "Lungs detox Kit",
    "slug": "lungs-detox-kit",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "detox-cleanses",
    "retailPrice": 99000,
    "rating": 4.9,
    "reviewCount": 29,
    "description": "Lungs detox kit : we have carefully selected this combination to help detox the lungs , help those with asthma , bronchitis, pneumonia, Lungs infection , shortness of breath , smokers , mucus, cold and flu . Kindly note this is not a substitute for medical diagnosis but a holistic approach to help alleviate the aforementioned problems.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/IMG-20260425-WA0010.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/IMG-20260425-WA0010.jpg"
    ],
    "availableStock": 5,
    "reservedStock": 3,
    "soldStock": 138,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": true,
    "skinConcern": [
      "Respiratory",
      "Immunity"
    ],
    "tags": [
      "Health kit",
      "Herbal blends",
      "Herbal supplements",
      "Herbs"
    ],
    "reviews": []
  },
  {
    "id": "hf_033",
    "name": "Herbal detox tea",
    "slug": "herbal-detox-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "detox-cleanses",
    "retailPrice": 15500,
    "rating": 4,
    "reviewCount": 1,
    "description": "Discover the incredible",
    "benefits": [
      "of our Herbal Detox Tea, expertly blended with 7 potent ingredients",
      "Garlic, Green Tea, Turmeric, Coriander, Moringa, and Rosehip",
      "This synergistic combination promotes overall wellness, supports detoxification, and enhances general body benefits",
      "Benefits of Each Ingredient 1",
      "Boosts immune system, antimicrobial and antifungal properties, supports cardiovascular health"
    ],
    "ingredients": [
      "Amino acid",
      "Antioxidant",
      "Detox",
      "Free radicals",
      "Herb",
      "Herbal blend"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG-4503.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG-4503.png"
    ],
    "availableStock": 30,
    "reservedStock": 0,
    "soldStock": 132,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Immunity"
    ],
    "tags": [
      "Herbal blends",
      "Herbs",
      "Amino acid",
      "Antioxidant",
      "Detox",
      "Free radicals",
      "Herb",
      "Herbal blend"
    ],
    "reviews": [
      {
        "id": "https___sbmholisticfarmacy_com_product_herbal-detox-tea__li-comment-67612",
        "author": "Jumoke",
        "rating": 4,
        "title": "Customer review 1",
        "body": "An awesome product for detox",
        "createdAt": "2026-05-11"
      }
    ]
  },
  {
    "id": "hf_034",
    "name": "Natural inhaler",
    "slug": "natural-inhaler",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 6500,
    "rating": 4.7,
    "reviewCount": 16,
    "description": "Breathe Better, Feel Better - The Natural Way Description The SBM Natural Inhaler is your pocket-sized solution for fast, effective relief from nasal congestion, headaches, dizziness, fatigue, and blocked sinuses. Crafted with a unique blend of therapeutic-grade essential oils, this all-natural inhaler clears your airways, refreshes your mind, and supports respiratory wellness - anytime, anywhere.",
    "benefits": [
      "Relieves Nasal Congestion",
      "Breaks up mucus and clears blocked nostrils due to cold, flu, sinusitis, or allergies",
      "Helps you breathe freely within seconds",
      "Eases Headaches & Dizziness",
      "Soothing aromatic oils provide fast relief from headaches and dizziness caused by stress, heat, or fatigue"
    ],
    "ingredients": [
      "this all-natural inhaler clears your airways",
      "refreshes your mind",
      "supports respiratory wellness - anytime",
      "anywhere",
      "eucalyptus",
      "peppermint"
    ],
    "howToUse": [
      "Uncap the inhaler",
      "Hold close to your nostril and gently inhale (1-2 deep breaths per nostril)",
      "Use as needed throughout the day Compact and travel-friendly",
      "keep it in your bag, pocket, or car for instant relief on the go."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0610.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0610.png"
    ],
    "availableStock": 125,
    "reservedStock": 1,
    "soldStock": 126,
    "damagedStock": 1,
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Respiratory",
      "Immunity"
    ],
    "tags": [
      "Aroma Healing",
      "Essential oils",
      "Asthma relief",
      "Cold",
      "Flu",
      "Inhaler",
      "Sinuses"
    ],
    "reviews": []
  },
  {
    "id": "hf_035",
    "name": "Anti Malaria Tea Mix 100G",
    "slug": "anti-malaria-tea-blend",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 19000,
    "rating": 4.8,
    "reviewCount": 19,
    "description": "Natural Herbal Support for Fever, Fatigue & Detoxification Product Overview The SBM Anti Malaria Tea Blend is a carefully formulated herbal infusion made from potent botanicals traditionally known for their antimalarial, detoxifying, and immune-boosting properties. This powerful blend supports the body's natural ability to combat malarial symptoms such as fever, body pain, chills, fatigue, and loss of appetite, while promoting faster recovery and strengthening the immune system.",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "Malaria"
    ],
    "howToUse": [
      "Add 1 tablespoon of the tea blend to 250-300ml of boiling water",
      "Allow to steep for 10-15 minutes",
      "Strain and drink morning and evening for 5-7 days or as recommended by your herbal health practitioner",
      "Can be taken warm or at room temperature"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/10/ChatGPT-Image-Oct-29-2025-02_17_23-PM.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/10/ChatGPT-Image-Oct-29-2025-02_17_23-PM.png"
    ],
    "availableStock": 1,
    "reservedStock": 2,
    "soldStock": 120,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Immunity",
      "Energy"
    ],
    "tags": [
      "Body detox",
      "Herbal blends",
      "Herbs",
      "Malaria"
    ],
    "reviews": []
  },
  {
    "id": "hf_036",
    "name": "Natural chest rub",
    "slug": "natural-chest-rub",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 10500,
    "rating": 4.9,
    "reviewCount": 22,
    "description": "Natural chest rub",
    "benefits": [
      "Decongest mucus Treats flu Treats cold Sinuses Relieves fever."
    ],
    "ingredients": [
      "Chest rub",
      "Cold",
      "Fever",
      "Mucus",
      "Sinuses"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0587.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0587.png"
    ],
    "availableStock": 8,
    "reservedStock": 3,
    "soldStock": 114,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Respiratory",
      "Stress relief"
    ],
    "tags": [
      "Chest rub",
      "Cold",
      "Fever",
      "Mucus",
      "Sinuses"
    ],
    "reviews": []
  },
  {
    "id": "hf_037",
    "name": "Immune booster",
    "slug": "immune-booster",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 20200,
    "rating": 4.6,
    "reviewCount": 25,
    "description": "Defend, Energize & Thrive Naturally Your immune system works tirelessly to protect you from harmful invaders and keep your body strong. SBM Immune Booster combines nature's most potent herbs and nutrients to fortify your body's defenses, improve resilience, and promote lasting vitality.",
    "benefits": [
      "Strengthens Immune Response",
      "Enhances your body's natural defense mechanisms to respond quickly and effectively to health threats",
      "Fights Bacteria & Viruses",
      "Contains antimicrobial and antiviral plant compounds to help your body resist common infectious agents",
      "Battles Foreign Bodies & Pathogens"
    ],
    "ingredients": [
      "antimicrobial"
    ],
    "howToUse": [
      "Add one teaspoon to hot water, let it cool and take day and night"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/22.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/22.png"
    ],
    "availableStock": 5,
    "reservedStock": 0,
    "soldStock": 108,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Immunity",
      "Energy"
    ],
    "tags": [
      "Herbal blends",
      "Herbs",
      "Bacteria",
      "Cold",
      "Dietary supplement",
      "Flu",
      "Immune boost",
      "Infection"
    ],
    "reviews": []
  },
  {
    "id": "hf_038",
    "name": "Soursop leaf tea",
    "slug": "soursop-leaf-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 17000,
    "rating": 4.7,
    "reviewCount": 28,
    "description": "Soursop leaf tea : Cancer",
    "benefits": [
      "Inhibits cancer cell growth and induces apoptosis (cell death) 2",
      "Effective against breast, prostate, colon, lung, and pancreatic cancers 3",
      "Reduces chemotherapy side effects 4",
      "Enhances radiation therapy effectiveness 5",
      "Anti-tumor properties GERD (Gastroesophageal Reflux Disease) Benefits"
    ],
    "ingredients": [
      "antioxidants: flavonoids",
      "phenolic acids",
      "ascorbic acid Precautions",
      "Interactions: 1"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0125.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0125.jpeg"
    ],
    "availableStock": 7,
    "reservedStock": 1,
    "soldStock": 102,
    "damagedStock": 0,
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Immunity",
      "Energy"
    ],
    "tags": [
      "Herbs",
      "Cancer",
      "Healing",
      "Health",
      "Herbal",
      "Holistic",
      "Soursop",
      "Ulcer"
    ],
    "reviews": []
  },
  {
    "id": "hf_039",
    "name": "Eucalyptus tea",
    "slug": "eucalyptus-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 15000,
    "rating": 4.8,
    "reviewCount": 12,
    "description": "Eucalyptus Tea",
    "benefits": [
      "Respiratory Benefits",
      "Relieves congestion and coughs 2",
      "Eases bronchitis, asthma, and COPD symptoms 3",
      "Opens airways and improves breathing 4",
      "Thins mucus for easier expulsion 5"
    ],
    "ingredients": [
      "Antioxidant",
      "Asthma",
      "Bad breath",
      "Bronchitis",
      "Cold",
      "Diabetes"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0162.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0162.jpeg"
    ],
    "availableStock": 2,
    "reservedStock": 2,
    "soldStock": 96,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Respiratory",
      "Immunity"
    ],
    "tags": [
      "Herbs",
      "Antioxidant",
      "Asthma",
      "Bad breath",
      "Bronchitis",
      "Cold",
      "Diabetes",
      "Headache"
    ],
    "reviews": []
  },
  {
    "id": "hf_040",
    "name": "Pain relief tea",
    "slug": "pain-relief-tea",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 15500,
    "rating": 4.9,
    "reviewCount": 15,
    "description": "SBM Holistic Farmacy Pain Relief Tea: Nature's Solution for Soothing Discomfort Our carefully crafted Pain Relief Tea combines the potent properties of Peppermint, Ginger, Capsaicin, Eucalyptus, Lavender, and Chamomile to provide natural relief from pain and discomfort.",
    "benefits": [
      "of Each Ingredient",
      "Peppermint",
      "Known for its calming effects, peppermint helps to ease muscle tension and relieve pain",
      "With its anti-inflammatory properties, ginger helps to reduce pain and inflammation, while also soothing digestive issues",
      "Capsaicin"
    ],
    "ingredients": [
      "Body pain",
      "Herbal blend",
      "Inflammation",
      "Muscle pain",
      "Pain relief"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG-4504.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG-4504.png"
    ],
    "availableStock": 52,
    "reservedStock": 3,
    "soldStock": 90,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": true,
    "skinConcern": [
      "Joint comfort",
      "Stress relief"
    ],
    "tags": [
      "Herbal blends",
      "Herbs",
      "Body pain",
      "Herbal blend",
      "Inflammation",
      "Muscle pain",
      "Pain relief"
    ],
    "reviews": []
  },
  {
    "id": "hf_041",
    "name": "Sleep time tea",
    "slug": "sleep-time-tea-2",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "immunity-relief",
    "retailPrice": 20000,
    "rating": 4.6,
    "reviewCount": 18,
    "description": "Sleep time Tea Promote relaxation, reduce stress and anxiety, and support overall well-being with our sleep time team. This expertly blended tea combines the calming properties of Valerian, Chamomile, Lemon, and Lavender to help you unwind and prepare for a restful night's sleep.",
    "benefits": [
      "Sleep and Insomnia",
      "Valerian and Chamomile promote deep relaxation, calm the nervous system, and improve sleep quality.",
      "Anxiety and Stress Relief",
      "Chamomile, Lavender, and Valerian reduce anxiety and stress, promoting a sense of calm and relaxation.",
      "Digestive Health"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/WhatsApp-Image-2025-08-27-at-9.11.57-PM.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/1970/01/WhatsApp-Image-2025-08-27-at-9.11.57-PM.jpeg"
    ],
    "availableStock": 22,
    "reservedStock": 0,
    "soldStock": 84,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": true,
    "skinConcern": [
      "Sleep",
      "Stress relief"
    ],
    "tags": [
      "Herbs"
    ],
    "reviews": []
  },
  {
    "id": "hf_042",
    "name": "Enzymes superfood",
    "slug": "enzymes-superfood",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 65000,
    "rating": 4.7,
    "reviewCount": 21,
    "description": "Enzymes Superfood Heal From Within. Digest.",
    "benefits": [
      "Supports Natural Fibroid Shrinking",
      "Helps the body break down and eliminate excess estrogen, a key contributor to fibroid growth",
      "Aids in Fibroid Dissolution",
      "Enzymes like bromelain and papain are known to help break down abnormal tissue and reduce inflammation",
      "Balances Hormones Naturally"
    ],
    "ingredients": [
      "Adenomyosis",
      "Adhesion",
      "Endometriosis",
      "Enzymes superfood",
      "Fallopian tubes",
      "Scar tissues"
    ],
    "howToUse": [
      "Mix 1 teaspoon in warm water, juice, or a morning smoothie",
      "Best taken on an empty stomach or before meals for fibroid and digestive support",
      "Use daily for consistent results",
      "Why Trust SBM's Enzymes Superfood Targets fibroid healing through the gut-liver-womb connection 100% plant-based, no additives or fillers Carefully formulated to work in synergy with natural fibroid protocols Safe, gentle, and effective for daily use Your womb deserves to heal"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0404.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0404.png"
    ],
    "availableStock": 12,
    "reservedStock": 1,
    "soldStock": 78,
    "damagedStock": 0,
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "skinConcern": [
      "Digestion",
      "Energy",
      "Menstrual support"
    ],
    "tags": [
      "Bundle supplements",
      "Herbal blends",
      "Adenomyosis",
      "Adhesion",
      "Endometriosis",
      "Enzymes superfood",
      "Fallopian tubes",
      "Scar tissues"
    ],
    "reviews": []
  },
  {
    "id": "hf_043",
    "name": "5-in-1 Mushroom Superfood Blend",
    "slug": "5-in-1-mushroom-superfood-blend",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 100000,
    "rating": 4.8,
    "reviewCount": 24,
    "description": "Powerful Antioxidant • Cellular Protection • Deep Detox • Immune Reinforcement Unlock the ancient healing power of medicinal mushrooms with our 5-in-1 Mushroom Superfood Blend, a premium formula crafted to nourish your body at the cellular level. This potent blend combines five of nature's most researched and therapeutic mushrooms Turkey Tail, Lion's Mane, Shiitake, Cordyceps, and Reishi to deliver unmatched antioxidant support, immune enhancement, and complete body rejuvenation.",
    "benefits": [
      "Turkey Tail Mushroom (Trametes versicolor) A powerhouse immune mushroom known for its rich polysaccharopeptides",
      "Supports the body's response to abnormal cell growth Strengthens immune cells Provides strong antioxidant support Helps balance the gut microbiome Lion's Mane Mushroom (Hericium erinaceus) Renowned for cognitive and nerve-protective benefits",
      "Boosts brain clarity and focus Supports nerve regeneration Enhances mood and memory Provides anti-inflammatory and antioxidant effects Shiitake Mushroom (Lentinula edodes) A restorative mushroom used for vitality and cellular wellness",
      "Supports cardiovascular health Provides anticancer and antiviral compounds Helps repair damaged cells Boosts skin and liver health Cordyceps Mushroom (Cordyceps militaris) A natural energy, stamina, and vitality booster",
      "Enhances oxygen utilisation Increases physical endurance Supports hormonal balance Strengthens immune defences Reishi Mushroom The \"King of Longevity\" and ultimate immune modulator"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-1.13.07-PM.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-1.13.07-PM.jpeg"
    ],
    "availableStock": 18,
    "reservedStock": 2,
    "soldStock": 72,
    "damagedStock": 0,
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": true,
    "skinConcern": [
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Body detox",
      "Health tools",
      "Herbal blends"
    ],
    "reviews": []
  },
  {
    "id": "hf_044",
    "name": "Shiitake Powder",
    "slug": "shiitake-powder",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 20500,
    "rating": 4.9,
    "reviewCount": 27,
    "description": "Nourish, Protect & Revitalize Naturally At SBM Holistic Farmacy, we believe food can be powerful medicine-especially when it comes from nature's most nutrient-dense sources. Shiitake mushrooms (Lentinula edodes) have been treasured in Asian medicine and cuisine for centuries, not only for their rich, savory taste but also for their remarkable health-supporting properties.",
    "benefits": [
      "of Shiitake Mushroom Powder Strengthens Immunity Shiitake mushrooms contain beta-glucans-natural polysaccharides that help modulate the immune system, making it more effective at defending against seasonal illnesses and infections",
      "Supports Heart & Circulatory Health Research suggests shiitake may help reduce cholesterol, improve blood vessel flexibility, and support healthy blood pressure-promoting overall cardiovascular wellness",
      "Balances Energy & Vitality Shiitake is traditionally seen as a \"qi\" (life energy) tonic, helping combat fatigue and restore balance to the body without overstimulation",
      "Rich in Antioxidants Loaded with compounds like selenium, ergothioneine, and polyphenols, shiitake helps protect cells from oxidative stress-slowing down premature ageing and supporting long-term health",
      "Supports Healthy Blood Sugar Some studies suggest that regular shiitake consumption may help maintain balanced blood sugar and improve insulin sensitivity"
    ],
    "ingredients": [
      "B-vitamins",
      "copper",
      "zinc",
      "manganese-essential for energy production",
      "immune defence",
      "metabolic balance"
    ],
    "howToUse": [
      "Soups & Stews",
      "Stir into broths, sauces, or stews for a rich, umami flavour",
      "Smoothies",
      "Blend ½-1 teaspoon into your smoothie for an immune boost"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-15-at-9.01.00-AM.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-15-at-9.01.00-AM.jpeg"
    ],
    "availableStock": 13,
    "reservedStock": 3,
    "soldStock": 66,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Immunity",
      "Energy"
    ],
    "tags": [
      "Herbal supplements",
      "Antioxidant",
      "Digestion",
      "Herbs",
      "Immunity"
    ],
    "reviews": []
  },
  {
    "id": "hf_045",
    "name": "Reishi Powder",
    "slug": "reishi-powder",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 20500,
    "rating": 4.6,
    "reviewCount": 30,
    "description": "SBM Reishi Powder",
    "benefits": [
      "Strengthens the Immune System",
      "Reishi mushroom is known for its powerful immune-modulating properties",
      "It helps enhance the activity of white blood cells, which are crucial for fighting infections and diseases",
      "Reduces Stress & Promotes Relaxation",
      "As a natural adaptogen, Reishi helps the body manage stress more effectively"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/05/ChatGPT-Image-May-15-2025-09_46_17-AM.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/05/ChatGPT-Image-May-15-2025-09_46_17-AM.png"
    ],
    "availableStock": 9,
    "reservedStock": 0,
    "soldStock": 60,
    "damagedStock": 1,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Immunity",
      "Stress relief"
    ],
    "tags": [
      "Uncategorized"
    ],
    "reviews": []
  },
  {
    "id": "hf_046",
    "name": "Wheatgrass powder",
    "slug": "wheatgrass-powder",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 19000,
    "rating": 4.7,
    "reviewCount": 14,
    "description": "WHEATGRASS POWDER Nutritional Content: 1. Rich in Vitamins A, C, E, and K 2.",
    "benefits": [
      "Boosts Energy and Endurance 2",
      "IMPORTANT NOTICE",
      "This product is not intended to diagnose, treat, cure, or prevent any disease The information on this website is for informational purposes only and not a substitute for professional medical advice This product is not NAFDAC approvedts Detoxification and Liver Health 3",
      "Alkalizes Body pH, Reducing Inflammation 4",
      "Enhances Digestive Health and Gut Bacteria 5"
    ],
    "ingredients": [
      "17 Amino Acids",
      "including essential ones 5"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/PHOTO-2023-05-14-04-20-50-3.jpg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/PHOTO-2023-05-14-04-20-50-3.jpg"
    ],
    "availableStock": 10,
    "reservedStock": 1,
    "soldStock": 54,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Energy",
      "Digestion"
    ],
    "tags": [
      "Herbs",
      "Antioxidant",
      "Blood sugar",
      "Cholesterol",
      "Heavy metal detox",
      "Inflammation",
      "Wheatgrass"
    ],
    "reviews": []
  },
  {
    "id": "hf_047",
    "name": "Irish Seamoss capsule",
    "slug": "sea-moss-capsule",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 30500,
    "rating": 4.8,
    "reviewCount": 17,
    "description": "Increases Energy Facilitates Weight Loss Improves Digestion Soothes Digestive Tract Improves Thyroid Function Relieves Joint and Muscle Pain Strengthens Connective Tissues and Joints Eliminates Cough, Phlegm, Mucus Promotes Recovery (Immunity Booster) Detoxify Body Relieves Respiratory Issues Helpful in Sore Throat Helpful in Bronchitis Helpful in Pneumonia Helpful in Tuberculosis Helpful in Chest Coughs",
    "benefits": [
      "Live-site description imported from SBM Holistic Farmacy.",
      "Plant-based wellness support for daily use."
    ],
    "ingredients": [
      "Immunity boost",
      "Iron",
      "Minerals and vitamins",
      "Seamoss",
      "Supplement"
    ],
    "howToUse": [
      "Use as directed on the product label or as advised by your practitioner."
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0193-1.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0193-1.jpeg"
    ],
    "availableStock": 28,
    "reservedStock": 2,
    "soldStock": 48,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": true,
    "skinConcern": [
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Capsules",
      "Herbal supplements",
      "Herbs",
      "Immunity boost",
      "Iron",
      "Minerals and vitamins",
      "Seamoss",
      "Supplement"
    ],
    "reviews": []
  },
  {
    "id": "hf_048",
    "name": "Turmeric Activated Powder Tea - 120g",
    "slug": "turmeric-activated-powder-tea-120g",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 13800,
    "rating": 4.9,
    "reviewCount": 20,
    "description": "Nature's Golden Healer for Detox, Inflammation & Immunity Product Description Discover the healing brilliance of nature's golden root with SBM Turmeric Activated Powder Tea, a powerful superfood blend designed to detoxify, rejuvenate, and strengthen your body from within. Made from 100% pure premium herbal powder this tea works as a natural anti-inflammatory and antioxidant powerhouse, helping to restore balance, boost immunity, and enhance your glow inside and out.",
    "benefits": [
      "Anti-Inflammatory & Joint Relief",
      "Curcumin in turmeric helps reduce inflammation, soothe sore joints, and improve mobility perfect for people managing arthritis, pain, or an active lifestyle",
      "Detoxification & Liver Health",
      "Supports natural liver cleansing, helping your body eliminate toxins and metabolic waste that cause fatigue, dull skin, and sluggish digestion",
      "Stronger Immunity"
    ],
    "ingredients": [
      "Botanical support blend",
      "See product page or label for full ingredient details"
    ],
    "howToUse": [
      "As a Tea",
      "Add 1 teaspoon (about 3g) into a cup of hot water or milk",
      "Stir well and let steep for 2-3 minutes",
      "Optional"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-05-at-12.00.24-PM.jpeg",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-05-at-12.00.24-PM.jpeg"
    ],
    "availableStock": 18,
    "reservedStock": 3,
    "soldStock": 42,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": false,
    "skinConcern": [
      "Immunity",
      "Joint comfort"
    ],
    "tags": [
      "Body detox",
      "Bundle supplements",
      "Herbal supplements"
    ],
    "reviews": []
  },
  {
    "id": "hf_049",
    "name": "Ginger powder",
    "slug": "ginger-powder",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 4200,
    "rating": 4.5,
    "reviewCount": 2,
    "description": "Ginger, a plant native to Asia, has been used for centuries for its medicinal properties. Its active compounds, gingerols and shogaols, are responsible for its potent anti-inflammatory and antioxidant effects. Specific Health",
    "benefits": [
      "Relieves Nausea and Digestive Issues",
      "Ginger's anti-inflammatory properties help reduce nausea and alleviate digestive issues, such as bloating and gas",
      "Reduces Pain and Inflammation",
      "Ginger's anti-inflammatory compounds help reduce pain and inflammation, making it an effective natural remedy for arthritis and muscle soreness",
      "Supports Heart Health"
    ],
    "ingredients": [
      "a range of antioxidants",
      "including vitamin C",
      "beta-carotene",
      "inflammation"
    ],
    "howToUse": [
      "Mix 1/2 to 1 teaspoon of ginger with warm water or tea to make a soothing drink",
      "Add fresh ginger to your favorite recipes, such as stir-fries, soups, and baked goods",
      "Take ginger capsules or supplements, following the recommended dosage",
      "Disclaimer:"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0367.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0367.png"
    ],
    "availableStock": 7,
    "reservedStock": 0,
    "soldStock": 36,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": true,
    "skinConcern": [
      "Digestion",
      "Immunity"
    ],
    "tags": [
      "Herbs",
      "Spices",
      "Arthritis.",
      "Calms nausea",
      "Ginger",
      "Muscle pain",
      "Pain relief"
    ],
    "reviews": [
      {
        "id": "https___sbmholisticfarmacy_com_product_ginger-powder__li-comment-67613",
        "author": "Jumoke",
        "rating": 4,
        "title": "Customer review 1",
        "body": "Great product",
        "createdAt": "2026-05-11"
      },
      {
        "id": "https___sbmholisticfarmacy_com_product_ginger-powder__li-comment-59370",
        "author": "Olusola",
        "rating": 5,
        "title": "Customer review 2",
        "body": "Quality 👍🏽",
        "createdAt": "2025-12-07"
      }
    ]
  },
  {
    "id": "hf_050",
    "name": "Spirulina powder",
    "slug": "spirulina-powder",
    "brand": "SBM Holistic Farmacy",
    "brandSlug": "sbm-holistic-farmacy",
    "category": "superfoods-wellness",
    "retailPrice": 15000,
    "rating": 4.7,
    "reviewCount": 26,
    "description": "Spirulina is a nutrient-dense algae that has been consumed for centuries for its numerous health",
    "benefits": [
      "This superfood is rich in protein, vitamins, minerals, and antioxidants, making it an excellent addition to a healthy diet",
      "Boosts Energy",
      "Spirulina's high iron content helps reduce fatigue and increase energy levels",
      "Supports Eye Health",
      "Spirulina's rich antioxidant content, including zeaxanthin and lutein, helps protect the eyes against age-related macular degeneration"
    ],
    "ingredients": [
      "a range of antioxidants",
      "including phycocyanin",
      "inflammation"
    ],
    "howToUse": [
      "Mix 1-2 teaspoons of spirulina powder with water or your favorite juice",
      "Add spirulina to your favorite smoothie or protein shake",
      "Sprinkle spirulina on top of salads or soups for an extra nutritional boost",
      "Disclaimer:"
    ],
    "images": [
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0428.png",
      "https://sbmholisticfarmacy.com/wp-content/uploads/2024/11/IMG_0428.png"
    ],
    "availableStock": 13,
    "reservedStock": 1,
    "soldStock": 30,
    "damagedStock": 0,
    "isFeatured": false,
    "isBestSeller": false,
    "isNewArrival": true,
    "skinConcern": [
      "Energy",
      "Immunity"
    ],
    "tags": [
      "Herbal supplements",
      "Herbs",
      "Anti inflammation",
      "Antioxidant",
      "Fertility",
      "Fibroid",
      "Spirulina powder",
      "Weight management"
    ],
    "reviews": []
  }
];

