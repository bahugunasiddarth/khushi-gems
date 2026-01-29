"use client";

import Link from "next/link";
import Image from "next/image";
import { goldCategories, goldBannerSlides, goldInstagramPosts } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/components/product-provider";
import { LoadingLogo } from "@/components/loading-logo";
import { ImageMarquee } from "@/components/image-marquee";
import { Button } from "@/components/ui/button";
import { Instagram, Loader2 } from "lucide-react";
import { useMemo } from "react";

// --- Enhanced Animation Constants (Matched to Reference) ---
const sectionAnimation = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } // Custom "Luxury" bezier
};

export default function GoldPage() {
  const { bestsellers, isLoading } = useProducts();

  // Filter gold bestsellers
  const goldBestsellers = useMemo(() => 
    bestsellers.filter(p => p.material === 'Gold'), 
    [bestsellers]
  );

  if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-background">
          <LoadingLogo size={80} />
          <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Loading Gold Collection...</p>
        </div>
      );
  }

  return (
    // CHANGED: gap-24 to gap-16 md:gap-24 for better mobile spacing
    <div className="flex flex-col gap-16 md:gap-24 overflow-hidden bg-background text-foreground">
      
      {/* --- HERO SECTION --- */}
      <motion.section 
        className="w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Carousel
          opts={{ loop: true, duration: 60 }}
          plugins={[
            Autoplay({
              delay: 6000,
              stopOnInteraction: false,
            }),
          ]}
          // CHANGED: h-screen to h-[100dvh] for mobile browsers
          className="w-full h-[100dvh] md:h-[95vh]"
        >
          <CarouselContent>
            {goldBannerSlides.map((slide) => (
              // CHANGED: Responsive height
              <CarouselItem key={slide.id} className="h-[100dvh] md:h-[87vh]">
                <div className="relative h-full w-full">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={slide.id === 1}
                    data-ai-hint={slide.imageHint}
                  />
                  {/* Refined Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none px-4">
              {/* Optional: Add Hero Text Overlay here if needed */}
          </div>

          <div className="absolute bottom-20 right-90 hidden md:flex gap-3">
             <CarouselPrevious className="static translate-y-0 text-white bg-white/10 border-white/20 hover:bg-white hover:text-black hover:border-white transition-colors duration-300 rounded-full w-6 h-6" />
             <CarouselNext className="static translate-y-0 text-white bg-white/10 border-white/20 hover:bg-white hover:text-black hover:border-white transition-colors duration-300 rounded-full w-6 h-6" />
          </div>
        </Carousel>
      </motion.section>

      {/* --- CATEGORIES SECTION --- */}
      {/* CHANGED: px-40 to responsive px-4 md:px-12 lg:px-40 */}
      <motion.section className="container mx-auto px-4 md:px-12 lg:px-40" data-ai-hint="shop by category" {...sectionAnimation}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-3">Explore</span>
            <h2 className="font-headline text-3xl md:text-5xl tracking-tight">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {goldCategories.map((category) => (
              <Link href={`/gold/${encodeURIComponent(category.name)}`} key={category.name}>
                <Card className="group relative overflow-hidden rounded-xl border-none shadow-none bg-gray-100 aspect-[3/4]">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        data-ai-hint={category.imageHint}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      {/* Text Layout */}
                      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        {/* CHANGED: Text sizing */}
                        <h3 className="font-headline text-lg md:text-xl text-white tracking-wide mb-1">{category.name}</h3>
                        <div className="h-px w-0 group-hover:w-12 bg-white/50 mx-auto transition-all duration-500 delay-100"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- BESTSELLERS SECTION --- */}
      <motion.section className="w-full bg-secondary/50 py-16 md:py-32" data-ai-hint="bestsellers carousel" {...sectionAnimation}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-2xl mx-auto">
            {/* Left Aligned Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 px-2">
              <div className="text-center md:text-left w-full md:w-auto">
                <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-3">Curated For You</span>
                <h2 className="font-headline text-3xl md:text-5xl tracking-tight mb-2">Our Gold Bestsellers</h2>
                <p className="text-muted-foreground font-light text-sm md:text-base">Timeless gold pieces, handcrafted with love</p>
              </div>
              <div className="hidden md:flex gap-2">
                 {/* Placeholder for custom nav if needed */}
              </div>
            </div>
            
            {isLoading ? (
               <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
               </div>
            ) : goldBestsellers && goldBestsellers.length > 0 ? (
                <Carousel 
                  opts={{ align: 'start', loop: true }} 
                  plugins={[
                    Autoplay({
                      delay: 4000,
                      stopOnInteraction: true,
                    }),
                  ]}
                  className="w-full group/carousel"
                >
                  <CarouselContent className="-ml-4 md:-ml-6">
                    {goldBestsellers.map((product) => (
                      // CHANGED: basis-[75%] for mobile (shows 1 card with peek), sm:basis-1/2
                      <CarouselItem key={product.id} className="basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4 md:pl-6">
                        <ProductCard product={product} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden md:block opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-12 w-12 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-12 w-12 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background" />
                  </div>
                </Carousel>
            ) : (
                  <div className="py-20 text-center border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">No bestseller products found.</p>
                  </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* --- INSTAGRAM SECTION --- */}
      {/* CHANGED: Fixed typo border-t10 to border-t and adjusted padding */}
      <motion.section className="py-16 md:py-32 border-t border-border/40" data-ai-hint="instagram feed" {...sectionAnimation}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-2xl mx-auto">
            {/* Center Header */}
            <div className="text-center mb-12">
               <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/30 mb-6">
                  <Instagram className="h-6 w-6 text-foreground" />
               </div>
              <h2 className="font-headline text-3xl md:text-5xl mb-3 tracking-tight break-all md:break-normal">@khushigemsandjewellery</h2>
              <p className="text-muted-foreground tracking-wide text-sm md:text-base">Follow our journey on Instagram</p>
            </div>
            
            <div className="py-8">
              <ImageMarquee baseVelocity={-1}>
                  {goldInstagramPosts.map((post) => (
                      <Link href={post.slug} key={post.id} target="_blank" rel="noopener noreferrer">
                      {/* CHANGED: Adjusted width for mobile */}
                      <div className="relative aspect-square w-56 md:w-80 overflow-hidden rounded-sm group mx-3 bg-gray-100">
                        <Image
                          src={post.imageUrl}
                          alt="Instagram post"
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          data-ai-hint={post.imageHint}
                        />
                         {/* Hover Overlay with Button */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="text-white text-xs font-bold tracking-widest uppercase border border-white/50 px-4 py-2 rounded-full">View Post</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </ImageMarquee>
            </div>
              
             <div className="text-center mt-10">
               <Button asChild className="rounded-full px-8 py-6 text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/80 w-full md:w-auto">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  Follow Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}