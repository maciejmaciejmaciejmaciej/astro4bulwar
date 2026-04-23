/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


import { ProductItem } from "./components/sections/ProductItem";
import { Project5a } from "./components/sections/Project5a";
import { About28 } from "./components/sections/About28";
import { Navbar } from "./components/sections/Navbar";
import { ReservationQuickBar } from "./components/sections/ReservationQuickBar";
import { StickyCartControls } from "./components/sections/StickyCartControls";
import { HeroSection } from "./components/sections/HeroSection";
import { ModernInterior } from "./components/sections/ModernInterior";
import { TheSelection } from "./components/sections/TheSelection";
import { OurServices } from "./components/sections/OurServices";
import { WielkanocSection } from "./components/sections/WielkanocSection";
import { BreakfastSection } from "./components/sections/BreakfastSection";
import { TheMenuSection } from "./components/sections/TheMenuSection";
import { GallerySection } from "./components/sections/GallerySection";
import { OfertaSection } from "./components/sections/OfertaSection";
import { QuoteSection } from "./components/sections/QuoteSection";
import { BlogSection } from "./components/sections/BlogSection";
import { SpecialOfferSection } from "./components/sections/SpecialOfferSection";
import { SalatkiNaWynosSection } from "./components/sections/SalatkiNaWynosSection";

import { CheckoutDrawer } from "@/components/CheckoutDrawer";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="bg-white text-on-surface font-body selection:bg-primary-fixed min-h-screen pb-16">
      <Navbar />

      <main>
        <HeroSection />

        <ReservationQuickBar />

        <ModernInterior />

        <TheSelection />

        <OurServices />

        <WielkanocSection />
<BreakfastSection />
<TheMenuSection />
<WielkanocSection />
<GallerySection />
<OfertaSection />
        <QuoteSection />
        <BlogSection />
        <SpecialOfferSection />
        <SalatkiNaWynosSection />

      </main>

  <footer aria-hidden="true" />

      <StickyCartControls onOpenCart={() => setIsCartOpen(true)} />

      <CheckoutDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
