import Image from "next/image";
import HeroSection from "./components/pages/heroSection";
import ProductSection from "./components/pages/ProductSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black">
      <HeroSection />
      <ProductSection showFeaturedOnly={true} />
      <Footer />
    </div>
  );
}