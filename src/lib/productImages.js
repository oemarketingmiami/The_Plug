// Vite-bundled product imagery: enumerates every .jpeg under
// /Products_images/<folder>/ at build time and groups by folder.
const modules = import.meta.glob('/Products_images/**/*.jpeg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const FOLDERS = {};
for (const [path, url] of Object.entries(modules)) {
  const m = path.match(/\/Products_images\/([^/]+)\//);
  if (!m) continue;
  const folder = m[1].toLowerCase();
  if (!FOLDERS[folder]) FOLDERS[folder] = [];
  FOLDERS[folder].push(url);
}
// Stable order so each vendor page renders the same 9 photos every time.
Object.values(FOLDERS).forEach((arr) => arr.sort());

// Order matters — first match wins. Specific bigrams before single keywords.
const KEYWORD_TO_FOLDER = [
  ['moissanite jewelry', 'jewelry'],
  ['moissanite watch',   'watches'],
  ['jewelry',            'jewelry'],
  ['necklace',           'jewelry'],
  ['ring',               'jewelry'],
  ['sneaker',            'shoes'],
  ['shoe',               'shoes'],
  ['cologne',            'cologne'],
  ['perfume',            'cologne'],
  ['fragrance',          'cologne'],
  ['watch',              'watches'],
  ['sunglass',           'sunglasses'],
  ['glass',              'sunglasses'],
  ['hoodie',             'clothes'],
  ['shirt',              'clothes'],
  ['clothing',           'clothes'],
];

const CATEGORY_TO_FOLDER = {
  clothing:    'clothes',
  fragrance:   'cologne',
  watches:     'watches',
  accessories: 'sunglasses',
  sports:      'shoes',
  jewelry:     'jewelry',
};

function pickFolder(product) {
  if (!product) return null;
  const haystack = `${product.slug || ''} ${product.name || ''}`.toLowerCase();
  for (const [kw, folder] of KEYWORD_TO_FOLDER) {
    if (haystack.includes(kw)) return folder;
  }
  return CATEGORY_TO_FOLDER[product.category] || null;
}

export function getProductImages(product, count = 9) {
  const folder = pickFolder(product);
  if (!folder) return [];
  const list = FOLDERS[folder] || [];
  return list.slice(0, count);
}

export function getProductFolder(product) {
  return pickFolder(product);
}

export const PRODUCT_IMAGE_FOLDERS = FOLDERS;
