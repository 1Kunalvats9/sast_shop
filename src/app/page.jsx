import Image from "next/image";
import HeroSection from "./components/pages/heroSection";
import ProductSection from "./components/pages/ProductSection";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <ProductSection showFeaturedOnly={true} />
      <Footer />
    </div>
  );
}