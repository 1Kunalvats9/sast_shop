'use client'
import ProductSection from '../components/pages/ProductSection';
import Navbar from '../components/Navbar';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        <ProductSection showFeaturedOnly={false} />
      </div>
    </div>
  );
}