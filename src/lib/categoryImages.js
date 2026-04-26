// Curated Unsplash photo IDs per vendor category. These are used as
// placeholder product imagery for cards without a real image_url, and
// as the source list for the landing page marquee.

const photo = (id) =>
  `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop&q=70`;

export const CATEGORY_IMAGES = {
  fragrance: [
    photo('photo-1541643600914-78b084683601'),
    photo('photo-1592945403244-b3fbafd7f539'),
    photo('photo-1523293182086-7651a899d37f'),
    photo('photo-1594035910387-fea47794261f'),
  ],
  watches: [
    photo('photo-1523275335684-37898b6baf30'),
    photo('photo-1524592094714-0f0654e20314'),
    photo('photo-1547996160-81dfa63595aa'),
    photo('photo-1622434641406-a158123450f9'),
  ],
  bags: [
    photo('photo-1548036328-c9fa89d128fa'),
    photo('photo-1591561954555-607968c989ab'),
    photo('photo-1584917865442-de89df76afd3'),
    photo('photo-1590874103328-eac38a683ce7'),
  ],
  sports: [
    photo('photo-1542291026-7eec264c27ff'),
    photo('photo-1606107557195-0e29a4b5b4aa'),
    photo('photo-1595950653106-6c9ebd614d3a'),
    photo('photo-1600185365778-7eb16ce93cb1'),
  ],
  clothing: [
    photo('photo-1490481651871-ab68de25d43d'),
    photo('photo-1551232864-3f0890e580d9'),
    photo('photo-1556905055-8f358a7a47b2'),
    photo('photo-1542838686-37da4a9fd1b3'),
  ],
  electronics: [
    photo('photo-1505740420928-5e560c06d30e'),
    photo('photo-1583394838336-acd977736f90'),
    photo('photo-1593642632559-0c6d3fc62b89'),
    photo('photo-1546435770-a3e426bf472b'),
  ],
  accessories: [
    photo('photo-1515562141207-7a88fb7ce338'),
    photo('photo-1599643477877-530eb83abc8e'),
    photo('photo-1611652022419-a9419f74343d'),
    photo('photo-1577720580479-7d839d829c73'),
  ],
  toys: [
    photo('photo-1558060370-d644479cb6f7'),
    photo('photo-1606503153255-59d8b8b82176'),
    photo('photo-1585366119957-e9730b6d0f60'),
    photo('photo-1586511934875-5c5411eaadf4'),
  ],
  bundle: [
    photo('photo-1607082348824-0a96f2a4b9da'),
    photo('photo-1607083206325-caf1edba7a83'),
    photo('photo-1556228852-80b6e5eeff06'),
    photo('photo-1611348586804-61bf6c080437'),
  ],
};

const DEFAULT_IMAGES = [
  photo('photo-1523275335684-37898b6baf30'),
  photo('photo-1548036328-c9fa89d128fa'),
  photo('photo-1541643600914-78b084683601'),
  photo('photo-1505740420928-5e560c06d30e'),
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
