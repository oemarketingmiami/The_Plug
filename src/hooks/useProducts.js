import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Seed/fallback data while Supabase is not yet configured
const SEED_PRODUCTS = [
  {
    id: '1',
    name: 'All Vendor Bundle (100+ Suppliers)',
    slug: 'all-vendor-bundle',
    description: 'The ultimate supplier bundle. Includes shirt, cologne, moissanite watch, moissanite jewelry, hoodie, and Prada suppliers — over 100 vendors total.',
    original_price: 69.99,
    sale_price: 29.99,
    is_on_sale: true,
    is_bundle: true,
    bundle_items: ['Shirt Supplier', 'Cologne Supplier', 'Moissanite Watch Supplier', 'Moissanite Jewelry Supplier', 'Hoodie Supplier', 'Prada Supplier'],
    category: 'bundle',
    image_url: null,
    active: true,
  },
  { id: '2', name: 'Cologne Vendor', slug: 'cologne-vendor', original_price: 19.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'fragrance', active: true },
  { id: '3', name: 'Cologne Supplier Bundle', slug: 'cologne-supplier-bundle', original_price: 19.99, sale_price: 9.99, is_on_sale: true, is_bundle: true, bundle_items: ['Cologne Vendor 1', 'Cologne Vendor 2'], category: 'fragrance', active: true },
  { id: '4', name: 'Jordan Vendor', slug: 'jordan-vendor', original_price: 19.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'shoes', active: true },
  { id: '5', name: 'Sneaker Vendor', slug: 'sneaker-vendor', original_price: 22.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'shoes', active: true },
  { id: '7', name: 'Watch Vendor', slug: 'watch-vendor', original_price: 17.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'watches', active: true },
  { id: '8', name: 'All Bag Vendor', slug: 'all-bag-vendor', original_price: 29.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'bags', active: true },
  { id: '9', name: 'Dyson Vendor', slug: 'dyson-vendor', original_price: null, sale_price: 9.99, is_on_sale: false, is_bundle: false, category: 'electronics', active: true },
  { id: '10', name: 'Glasses Vendor', slug: 'glasses-vendor', original_price: 19.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'accessories', active: true },
  { id: '12', name: 'Hoodie Supplier', slug: 'hoodie-supplier', original_price: 19.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'clothing', active: true },
  { id: '13', name: 'Moissanite Watch Vendor', slug: 'moissanite-watch-vendor', original_price: 23.99, sale_price: 9.99, is_on_sale: true, is_bundle: false, category: 'watches', active: true },
];

// Module-level cache: dedupes the network request when multiple components
// (e.g., Sidebar + Home) call useProducts() on the same page load.
let cachedPromise = null;

function loadProducts() {
  if (cachedPromise) return cachedPromise;
  cachedPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data && data.length > 0 ? data : SEED_PRODUCTS;
    } catch {
      return SEED_PRODUCTS;
    }
  })();
  return cachedPromise;
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadProducts().then((data) => {
      if (cancelled) return;
      setProducts(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

export function useProduct(slug) {
  const { products, loading } = useProducts();
  const product = products.find(p => p.slug === slug) || null;
  return { product, loading };
}
