import ProductCard from './ProductCard';
import BundleCard from './BundleCard';

export default function ProductGrid({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-[#AAAAAA] py-20">
        No products found.
      </div>
    );
  }

  const bundles = products.filter(p => p.is_bundle);
  const regular = products.filter(p => !p.is_bundle);

  return (
    <div className="space-y-6">
      {/* Bundles — full-width cards */}
      {bundles.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {bundles.map(product => (
            <BundleCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}

      {/* Regular products — responsive grid */}
      {regular.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {regular.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
