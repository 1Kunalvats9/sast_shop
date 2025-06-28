'use client'
import ProductSection from '../components/pages/ProductSection';

export default function ProductsPage() {
  return (
    <div className="pt-20">
      <ProductSection showFeaturedOnly={false} />
    </div>
  );
}