// Curated Unsplash photo IDs per vendor category. These are used as
// placeholder product imagery for cards without a real image_url, and
// as the source list for the landing page marquee.

export const CATEGORY_IMAGES = {
  fragrance: [
    '/Products_images/cologne/WhatsApp Image 2026-04-25 at 2.38.15 AM (1).jpeg',
    '/Products_images/cologne/WhatsApp Image 2026-04-25 at 2.38.15 AM (2).jpeg',
  ],
  watches: [
    '/Products_images/watches/WhatsApp Image 2026-04-25 at 2.58.47 AM (1).jpeg',
    '/Products_images/watches/WhatsApp Image 2026-04-25 at 2.58.47 AM (10).jpeg',
  ],
  bags: [
    '/Products_images/clothes/WhatsApp Image 2026-04-25 at 2.48.17 AM (1).jpeg',
  ],
  clothing: [
    '/Products_images/clothes/WhatsApp Image 2026-04-25 at 2.48.17 AM (2).jpeg',
  ],
  shoes: [
    '/Products_images/shoes/WhatsApp Image 2026-04-25 at 2.11.07 AM (1).jpeg',
    '/Products_images/shoes/WhatsApp Image 2026-04-25 at 2.11.07 AM (2).jpeg',
  ],
  accessories: [
    '/Products_images/sunglasses/WhatsApp Image 2026-04-25 at 2.25.11 AM (1).jpeg',
    '/Products_images/sunglasses/WhatsApp Image 2026-04-25 at 2.25.11 AM (2).jpeg',
  ],
  bundle: [
    '/Products_images/jewelry/WhatsApp Image 2026-04-25 at 3.00.08 AM (1).jpeg',
    '/Products_images/jewelry/WhatsApp Image 2026-04-25 at 3.00.08 AM (2).jpeg',
  ],
};

const DEFAULT_IMAGES = [
  '/Products_images/clothes/WhatsApp Image 2026-04-25 at 2.48.17 AM (1).jpeg',
  '/Products_images/cologne/WhatsApp Image 2026-04-25 at 2.38.15 AM (1).jpeg',
  '/Products_images/jewelry/WhatsApp Image 2026-04-25 at 3.00.08 AM (1).jpeg',
  '/Products_images/watches/WhatsApp Image 2026-04-25 at 2.58.47 AM (1).jpeg',
];

export function getCategoryImage(category, seed) {
  const list = CATEGORY_IMAGES[category] || DEFAULT_IMAGES;
  const idx = Math.abs(seed) % list.length;
  return list[idx];
}

// Curated showcase used by the landing-page marquee — one image per
// category so the strip reads like a "tour" of what the site sells.
export const HERO_MARQUEE_IMAGES = [
  '/Products_images/clothes/WhatsApp Image 2026-04-25 at 2.48.17 AM (1).jpeg',
  '/Products_images/cologne/WhatsApp Image 2026-04-25 at 2.38.15 AM (1).jpeg',
  '/Products_images/jewelry/WhatsApp Image 2026-04-25 at 3.00.08 AM (1).jpeg',
  '/Products_images/shoes/WhatsApp Image 2026-04-25 at 2.11.07 AM (1).jpeg',
  '/Products_images/sunglasses/WhatsApp Image 2026-04-25 at 2.25.11 AM (1).jpeg',
  '/Products_images/watches/WhatsApp Image 2026-04-25 at 2.58.47 AM (1).jpeg',
  '/Products_images/clothes/WhatsApp Image 2026-04-25 at 2.48.17 AM (2).jpeg',
  '/Products_images/cologne/WhatsApp Image 2026-04-25 at 2.38.15 AM (2).jpeg',
  '/Products_images/jewelry/WhatsApp Image 2026-04-25 at 3.00.08 AM (2).jpeg',
  '/Products_images/shoes/WhatsApp Image 2026-04-25 at 2.11.07 AM (2).jpeg',
  '/Products_images/sunglasses/WhatsApp Image 2026-04-25 at 2.25.11 AM (2).jpeg',
  '/Products_images/watches/WhatsApp Image 2026-04-25 at 2.58.47 AM (10).jpeg',
];
