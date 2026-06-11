import type { Product, ProductCategory } from "@/types/product";

// Mirrors Client mock-products (same IDs and slugs) so orders, deliveries
// and refunds cross-reference cleanly. Admin shape adds sku, costPrice,
// lowStockThreshold and status fields.
interface Seed {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  retail: number;
  cost: number;
  stock: number;
  threshold: number;
  desc: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  flags?: { featured?: boolean; bestSeller?: boolean; newArrival?: boolean };
  tags?: string[];
  damaged?: number;
  reserved?: number;
  sold?: number;
  image_1: string;
  image_2: string;
  image_3: string;
}

const ISTOCK_MORTAR =
  "https://media.istockphoto.com/id/173253353/photo/chinese-herbal-medicine-with-mortor-and-pestle-on-wood-hz.webp?a=1&b=1&s=612x612&w=0&k=20&c=8PzH3aBS1PkTSQpIbQNxmcQ51DlAUcdZiaP_SnL7AZc=";
const ISTOCK_ECHINACEA =
  "https://media.istockphoto.com/id/2264341214/photo/echinacea-drop-bottle.webp?a=1&b=1&s=612x612&w=0&k=20&c=Sye4-N_HTViWZyERrUJ2658yiaYedA9adOrLLzBz7iE=";
const GOSUPPS_KOLA = "https://www.gosupps.com/media/catalog/product/7/1/711TUtTdGkL.jpg";
const u = (id: string) =>
  `https://unsplash.com/photos/${id}/download?force=true&w=1400`;

const seeds: Seed[] = [
  // Herbal Medicare
  { id: "p_101", name: "Malaria & Fever Bitter Tonic", slug: "malaria-fever-bitter-tonic", brand: "Kuru Apothecary", category: "herbal-medicare", retail: 14500, cost: 6200, stock: 28, threshold: 6, desc: "Cinchona, neem and dogonyaro bitter — taken at first symptoms.", benefits: ["Supports the body during febrile episodes", "Traditional formulation"], ingredients: ["Cinchona", "Neem", "Dogonyaro", "Ginger"], howToUse: ["15 ml in warm water 3× daily for 5 days"], flags: { featured: true, bestSeller: true }, tags: ["traditional"], reserved: 2, sold: 312, image_1: ISTOCK_MORTAR, image_2: u("59Kh3TAajg0"), image_3: u("HcpqoHit2zg") },
  { id: "p_102", name: "Eucalyptus Chest Rub", slug: "eucalyptus-chest-rub", brand: "naturale.", category: "herbal-medicare", retail: 7900, cost: 3000, stock: 25, threshold: 8, desc: "Eucalyptus and camphor balm for blocked chests.", benefits: ["Eases blocked sinuses", "Warming"], ingredients: ["Eucalyptus", "Menthol", "Camphor", "Coconut"], howToUse: ["Massage onto chest and upper back"], flags: { newArrival: true }, sold: 150, image_1: ISTOCK_ECHINACEA, image_2: u("sBTcIRrZdN4"), image_3: u("uPM21Jfoi7c") },
  { id: "p_103", name: "Throat-Soothe Honey & Ginger Tea", slug: "throat-soothe-tea", brand: "Kuru Apothecary", category: "herbal-medicare", retail: 7500, cost: 2800, stock: 18, threshold: 10, desc: "Slippery elm, ginger, licorice with honey crystals.", benefits: ["Comforts throat", "Warming"], ingredients: ["Slippery elm", "Ginger", "Licorice", "Honey crystals", "Marshmallow root"], howToUse: ["Steep 8 min, up to 3 cups daily"], flags: { featured: true, bestSeller: true }, sold: 240, image_1: u("XbYnaCbUWnI"), image_2: u("0p1iYK3ep-I"), image_3: u("59Kh3TAajg0") },
  { id: "p_104", name: "Echinacea Immune Tincture", slug: "echinacea-immune-tincture", brand: "Kuru Apothecary", category: "herbal-medicare", retail: 12800, cost: 5200, stock: 10, threshold: 6, desc: "Slow-extracted echinacea root and aerial.", benefits: ["Immune resilience", "Seasonal support"], ingredients: ["Echinacea purpurea", "Cane alcohol", "Filtered water"], howToUse: ["2 ml in water 3× daily at first signs"], sold: 90, image_1: ISTOCK_ECHINACEA, image_2: u("HcpqoHit2zg"), image_3: u("59Kh3TAajg0") },

  // Herbal wellness
  { id: "p_022", name: "Hibiscus + Rose Hip Wellness Tea", slug: "hibiscus-wellness-tea", brand: "Olulami", category: "herbal-wellness", retail: 6500, cost: 2200, stock: 70, threshold: 15, desc: "Whole-flower hibiscus and rose hip — vitamin-C routine.", benefits: ["Vitamin C routine", "Caffeine-free"], ingredients: ["Hibiscus", "Rose hip", "Cinnamon"], howToUse: ["Steep 6 min in hot water"], flags: { featured: true, bestSeller: true }, tags: ["caffeine-free"], sold: 200, image_1: u("pUp3YQau3nI"), image_2: u("9T5FvfnmH_k"), image_3: u("iMu5Lq3EDsE") },
  { id: "p_023", name: "Calm-Belly Peppermint Infusion", slug: "calm-belly-peppermint", brand: "naturale.", category: "herbal-wellness", retail: 6900, cost: 2500, stock: 26, threshold: 12, desc: "Peppermint and fennel after meals.", benefits: ["Post-meal", "Gentle"], ingredients: ["Peppermint", "Fennel", "Lemon balm"], howToUse: ["Steep 5 min after meals"], flags: { featured: true, newArrival: true }, tags: ["caffeine-free"], sold: 132, image_1: u("0p1iYK3ep-I"), image_2: u("1xe1Zq4RIZg"), image_3: u("9T5FvfnmH_k") },
  { id: "p_020", name: "Lavender Sleep Pillow Mist", slug: "lavender-sleep-mist", brand: "naturale.", category: "herbal-wellness", retail: 8200, cost: 3100, stock: 50, threshold: 10, desc: "Lavender and chamomile pillow mist for sleep.", benefits: ["Calms before sleep", "Herbal scent"], ingredients: ["Lavender", "Roman chamomile", "Vetiver"], howToUse: ["Mist pillow before sleep"], flags: { newArrival: true }, reserved: 1, sold: 135, image_1: u("tfnaRJwiqfc"), image_2: u("dJ4JgX5I5y8"), image_3: u("uPM21Jfoi7c") },
  { id: "p_024", name: "Sleep routine Kit", slug: "sleep-routine-set", brand: "naturale.", category: "herbal-wellness", retail: 28500, cost: 12000, stock: 12, threshold: 4, desc: "Ashwagandha drops, lavender mist, peppermint tea.", benefits: ["Wind-down routine", "Gifting"], ingredients: ["Ashwagandha drops", "Pillow mist", "Peppermint tea"], howToUse: ["Use as evening sequence"], flags: { featured: true, newArrival: true }, tags: ["gifting"], reserved: 1, sold: 64, image_1: u("S5UaZz42bZY"), image_2: u("dJ4JgX5I5y8"), image_3: u("IKObV_55tXI") },

  // Natural health
  { id: "p_018", name: "Moringa + Iron Botanical", slug: "moringa-iron-botanical", brand: "Sage & Stem", category: "natural-health", retail: 8400, cost: 3500, stock: 38, threshold: 10, desc: "Plant iron with moringa, folate, vitamin C.", benefits: ["Daily energy", "Plant-based iron"], ingredients: ["Moringa oleifera", "Folate (5-MTHF)", "Vitamin C"], howToUse: ["2 capsules with breakfast"], tags: ["vegan"], sold: 120, image_1: u("PBj0dEYIbew"), image_2: u("chExmKr8lEY"), image_3: u("fz7nSSfQDZo") },
  { id: "p_301", name: "Sea Moss + Bladderwrack Capsules", slug: "sea-moss-bladderwrack-capsules", brand: "Renew Botanics", category: "natural-health", retail: 13500, cost: 5600, stock: 32, threshold: 8, desc: "Wildcrafted Irish sea moss with bladderwrack and burdock.", benefits: ["Trace minerals", "Thyroid support"], ingredients: ["Irish sea moss", "Bladderwrack", "Burdock"], howToUse: ["2 capsules in morning"], flags: { featured: true, newArrival: true }, tags: ["vegan"], reserved: 1, sold: 184, image_1: u("lO0-lXuh1AU"), image_2: u("OCXKWRZ7a70"), image_3: u("3mzAtQQKZIQ") },
  { id: "p_302", name: "Spirulina & Chlorella Greens", slug: "spirulina-chlorella-greens", brand: "Sage & Stem", category: "natural-health", retail: 11200, cost: 4500, stock: 44, threshold: 10, desc: "Spirulina + chlorella daily greens.", benefits: ["B-vitamins", "Detoxification support"], ingredients: ["Spirulina", "Broken-cell chlorella"], howToUse: ["1 tsp into water or smoothie"], tags: ["vegan"], sold: 96, image_1: u("2aGURL-fC1Q"), image_2: u("1MX-FjwRJWQ"), image_3: u("S4BQEwatXl0") },
  { id: "p_303", name: "Beetroot + Hibiscus Energy Powder", slug: "beetroot-hibiscus-energy", brand: "naturale.", category: "natural-health", retail: 9800, cost: 3900, stock: 20, threshold: 8, desc: "Beetroot for nitric oxide, hibiscus for vitamin C.", benefits: ["Pre-workout", "Caffeine-free"], ingredients: ["Beetroot", "Hibiscus", "Ginger", "Acerola"], howToUse: ["1 scoop in cold water 20 min before activity"], flags: { newArrival: true }, tags: ["caffeine-free"], sold: 88, image_1: u("VOdONjAP_Lk"), image_2: u("iMu5Lq3EDsE"), image_3: u("fQ5NRUwqo6k") },

  // Herbal remedies
  { id: "p_401", name: "Ginger + Turmeric Cold-Shot Tonic", slug: "ginger-turmeric-cold-shot", brand: "Olulami", category: "herbal-remedies", retail: 10500, cost: 4200, stock: 36, threshold: 10, desc: "Cold-pressed ginger, turmeric, black pepper, lemon shot.", benefits: ["Warming immune routine", "No added sugar"], ingredients: ["Ginger", "Turmeric", "Black pepper", "Lemon", "Cayenne"], howToUse: ["25 ml shot each morning"], flags: { featured: true, bestSeller: true }, tags: ["raw"], reserved: 2, sold: 280, image_1: u("u1oTVA9Fkbc"), image_2: u("wM2gx805g0M"), image_3: u("2BsVW_edjH8") },
  { id: "p_402", name: "Garlic + Olive Leaf Cardio Drops", slug: "garlic-olive-leaf-cardio", brand: "Sage & Stem", category: "herbal-remedies", retail: 11500, cost: 4800, stock: 22, threshold: 6, desc: "Aged garlic, olive leaf, hawthorn cardio tonic.", benefits: ["Blood-pressure support", "Cardiovascular tonic"], ingredients: ["Aged garlic", "Olive leaf", "Hawthorn", "Glycerin"], howToUse: ["1 ml under tongue 2× daily"], tags: ["alcohol-free"], sold: 95, image_1: u("c9t9ofCyE4A"), image_2: u("HcpqoHit2zg"), image_3: ISTOCK_ECHINACEA },
  { id: "p_403", name: "Milk Thistle Liver Tonic", slug: "milk-thistle-liver-tonic", brand: "Kuru Apothecary", category: "herbal-remedies", retail: 12200, cost: 5000, stock: 14, threshold: 6, desc: "Standardised milk thistle tonic with dandelion and artichoke leaf.", benefits: ["Liver support", "Standardised silymarin"], ingredients: ["Milk thistle", "Dandelion", "Artichoke leaf"], howToUse: ["20 drops in water 2× daily"], flags: { newArrival: true }, sold: 102, image_1: u("uPM21Jfoi7c"), image_2: u("HcpqoHit2zg"), image_3: u("59Kh3TAajg0") },
  { id: "p_404", name: "Soursop Leaf Tea", slug: "soursop-leaf-tea", brand: "Olulami", category: "herbal-remedies", retail: 7400, cost: 2700, stock: 30, threshold: 8, desc: "Hand-picked, shade-dried soursop (graviola) leaves.", benefits: ["Calming evening brew", "Shade-dried"], ingredients: ["Soursop leaf"], howToUse: ["Crumble 2 leaves into hot water, steep 10 min"], tags: ["caffeine-free"], sold: 145, image_1: u("MS75jlbCaBc"), image_2: u("IfeH_X2DJ-o"), image_3: u("iMu5Lq3EDsE") },

  // Supplements
  { id: "p_015", name: "Turmeric + Black Pepper Capsules", slug: "turmeric-black-pepper-capsules", brand: "Sage & Stem", category: "supplements", retail: 9200, cost: 3800, stock: 80, threshold: 12, desc: "Curcumin 95% with piperine for joint comfort.", benefits: ["Joint comfort", "Inflammation balance"], ingredients: ["Curcuma longa 95%", "Piperine"], howToUse: ["1 capsule with food daily"], flags: { featured: true, bestSeller: true }, tags: ["vegan", "GMP-certified"], reserved: 5, sold: 330, image_1: u("3mzAtQQKZIQ"), image_2: u("wFsyE8B1aY8"), image_3: u("l7TtkTbLAxI") },
  { id: "p_016", name: "Ashwagandha Calm Drops", slug: "ashwagandha-calm-drops", brand: "Sage & Stem", category: "supplements", retail: 11500, cost: 4900, stock: 22, threshold: 8, desc: "KSM-66 ashwagandha tincture for evening rest.", benefits: ["Calm focus", "Restful sleep"], ingredients: ["Ashwagandha KSM-66", "Glycerin", "Water"], howToUse: ["1 ml under tongue, 30 min before bed"], flags: { newArrival: true }, tags: ["alcohol-free"], reserved: 1, sold: 156, image_1: u("5peJ_ul3B8g"), image_2: ISTOCK_ECHINACEA, image_3: u("uPM21Jfoi7c") },
  { id: "p_019", name: "Digestive Bitters Tonic", slug: "digestive-bitters-tonic", brand: "Kuru Apothecary", category: "supplements", retail: 10800, cost: 4400, stock: 14, threshold: 6, desc: "Dandelion, ginger and gentian bitters tonic.", benefits: ["Eases bloating", "Pre-meal routine"], ingredients: ["Dandelion", "Ginger", "Gentian", "Fennel"], howToUse: ["5 ml in water 10 min before meals"], flags: { newArrival: true }, sold: 70, image_1: u("UPAG0IPIzzU"), image_2: u("hYd0I9bbHTY"), image_3: u("SmVQ5lBdRSs") },
  { id: "p_501", name: "Ginkgo + Brahmi Focus Capsules", slug: "ginkgo-brahmi-focus", brand: "Sage & Stem", category: "supplements", retail: 12500, cost: 5000, stock: 24, threshold: 8, desc: "Ginkgo biloba + bacopa nootropic blend.", benefits: ["Memory and focus", "Daily nootropic"], ingredients: ["Ginkgo biloba 24%", "Bacopa 20%", "Gotu kola", "Rosemary"], howToUse: ["2 capsules with breakfast"], tags: ["vegan"], sold: 110, image_1: u("3mzAtQQKZIQ"), image_2: u("l7TtkTbLAxI"), image_3: u("59Kh3TAajg0") },

  // Organic support
  { id: "p_601", name: "Organic Moringa Leaf Powder", slug: "organic-moringa-powder", brand: "Olulami", category: "organic-support", retail: 9500, cost: 3700, stock: 60, threshold: 12, desc: "Shade-dried single-origin Nigerian moringa leaf.", benefits: ["Vitamins A, C, E, iron", "Single-origin"], ingredients: ["Organic moringa oleifera leaf"], howToUse: ["1 tsp into water or juice each morning"], flags: { featured: true, bestSeller: true }, tags: ["organic", "bestseller"], reserved: 2, sold: 410, image_1: u("YNh69F9DVx0"), image_2: u("Se_MEgzAOFI"), image_3: u("E5gl7qBCkH0") },
  { id: "p_602", name: "Raw Honey + Propolis Throat Spray", slug: "raw-honey-propolis-spray", brand: "Kuru Apothecary", category: "organic-support", retail: 8800, cost: 3400, stock: 36, threshold: 10, desc: "Ethically-harvested raw honey + propolis throat spray.", benefits: ["Coats throat", "Raw Nigerian honey"], ingredients: ["Raw honey", "Propolis", "Thyme", "Sage", "Glycerin"], howToUse: ["2 pumps to back of throat up to 4× daily"], flags: { newArrival: true }, tags: ["organic"], reserved: 1, sold: 188, image_1: u("U0qJT3ynHOE"), image_2: u("GfFGAnMEQ9I"), image_3: u("fQ5NRUwqo6k") },
  { id: "p_603", name: "Organic Aloe Vera Juice", slug: "organic-aloe-vera-juice", brand: "Renew Botanics", category: "organic-support", retail: 9800, cost: 3900, stock: 18, threshold: 6, desc: "Cold-pressed organic aloe vera inner-leaf juice.", benefits: ["Digestive comfort", "Cold-pressed"], ingredients: ["Organic aloe vera", "Lemon juice"], howToUse: ["30 ml on empty stomach in morning"], tags: ["organic"], sold: 64, image_1: u("xay9Wc6wi-c"), image_2: u("L3EdpLpfPhE"), image_3: u("OrpfcyDwBbg") },
  { id: "p_013", name: "Arnica Muscle Salve", slug: "arnica-muscle-salve", brand: "Renew Botanics", category: "organic-support", retail: 11400, cost: 4600, stock: 28, threshold: 10, desc: "Arnica, ginger, St. John's wort in organic shea.", benefits: ["Soothes overworked muscles", "Massage-ready"], ingredients: ["Organic arnica", "Ginger", "St. John's wort", "Organic shea"], howToUse: ["Massage into sore muscles up to 3× daily"], tags: ["organic"], sold: 78, image_1: u("sBTcIRrZdN4"), image_2: u("uPM21Jfoi7c"), image_3: u("HcpqoHit2zg") },

  // Traditional medicine
  { id: "p_701", name: "Agbo Jedi Herbal Bitters", slug: "agbo-jedi-bitters", brand: "Olulami", category: "traditional-medicine", retail: 13800, cost: 5600, stock: 22, threshold: 6, desc: "Yoruba Agbo Jedi cleansing brew.", benefits: ["Cleansing", "Womb and digestive comfort"], ingredients: ["Bitter leaf", "Dogonyaro", "Mango bark", "Lime peel", "Cane molasses"], howToUse: ["30 ml in morning for 5 days, rest 14 days"], flags: { featured: true, bestSeller: true }, tags: ["traditional", "bestseller"], reserved: 1, sold: 305, image_1: ISTOCK_MORTAR, image_2: u("EHG22u_SIfI"), image_3: u("HcpqoHit2zg") },
  { id: "p_702", name: "Bitter Leaf (Ewuro) Detox Capsules", slug: "bitter-leaf-detox-capsules", brand: "Olulami", category: "traditional-medicine", retail: 9800, cost: 3900, stock: 40, threshold: 10, desc: "Encapsulated bitter-leaf (ewuro / onugbu).", benefits: ["Detox support", "Taste-sensitive"], ingredients: ["Bitter leaf powder", "Ginger"], howToUse: ["1 capsule AM and 1 PM for 10 days"], flags: { newArrival: true }, tags: ["traditional", "vegan"], sold: 154, image_1: u("IfeH_X2DJ-o"), image_2: u("fz7nSSfQDZo"), image_3: u("59Kh3TAajg0") },
  { id: "p_703", name: "Black Seed (Habba Sauda) Capsules", slug: "black-seed-habba-sauda", brand: "Kuru Apothecary", category: "traditional-medicine", retail: 10800, cost: 4400, stock: 34, threshold: 8, desc: "Cold-pressed Nigella sativa black seed oil softgels.", benefits: ["Immune and respiratory support", "Cold-pressed"], ingredients: ["Nigella sativa oil"], howToUse: ["2 softgels with food, AM and PM"], flags: { featured: true }, tags: ["traditional"], sold: 220, image_1: u("3mzAtQQKZIQ"), image_2: u("l7TtkTbLAxI"), image_3: u("59Kh3TAajg0") },
  { id: "p_704", name: "Bitter Kola + Kola Nut Energy Tonic", slug: "bitter-kola-energy-tonic", brand: "Olulami", category: "traditional-medicine", retail: 9400, cost: 3700, stock: 12, threshold: 6, desc: "West-African bitter kola + kola nut energy tonic.", benefits: ["Natural energy", "Traditional formulation"], ingredients: ["Bitter kola", "Kola nut", "Ginger", "Lime"], howToUse: ["20 ml in water in morning"], flags: { newArrival: true }, tags: ["traditional"], sold: 68, image_1: GOSUPPS_KOLA, image_2: u("aj4L38B6j1A"), image_3: u("fQ5NRUwqo6k") },
];

const CATEGORY_PREFIX = {
  "herbal-medicare": "MED",
  "herbal-wellness": "WEL",
  "natural-health": "NAT",
  "herbal-remedies": "REM",
  supplements: "SUP",
  "organic-support": "ORG",
  "traditional-medicine": "TRD",
} as const;

export const MOCK_PRODUCTS: Product[] = seeds.map((s, i) => ({
  id: s.id,
  sku: `HRB-${CATEGORY_PREFIX[s.category as keyof typeof CATEGORY_PREFIX]}-${s.id.replace(/[^0-9]/g, "")}`,
  name: s.name,
  slug: s.slug,
  brand: s.brand,
  category: s.category,
  description: `${s.desc} Made in small batches, third-party tested for purity.`,
  shortDescription: s.desc,
  benefits: s.benefits,
  ingredients: s.ingredients,
  howToUse: s.howToUse,
  images: [s.image_1, s.image_2, s.image_3],
  retailPrice: s.retail,
  costPrice: s.cost,
  availableStock: s.stock,
  reservedStock: s.reserved ?? 0,
  soldStock: s.sold ?? 0,
  returnedStock: 0,
  damagedStock: s.damaged ?? 0,
  lowStockThreshold: s.threshold,
  status: "active",
  isFeatured: !!s.flags?.featured,
  isBestSeller: !!s.flags?.bestSeller,
  isNewArrival: !!s.flags?.newArrival,
  tags: s.tags ?? [],
  seoTitle: undefined,
  seoDescription: undefined,
  createdAt: new Date(2025, (i + 1) % 12, ((i + 1) * 7) % 27 + 1).toISOString(),
  updatedAt: new Date(2026, 4, ((i + 1) * 3) % 27 + 1).toISOString(),
}));
