"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { ImageMarquee } from '@/components/image-marquee';
import { heroSlides, silverCategories, collections, silverInstagramPosts } from '@/lib/data';
import { Instagram, Loader2, Diamond, ArrowRight } from 'lucide-react'; 
import Autoplay from "embla-carousel-autoplay"
import { Marquee } from '@/components/marquee';
import { ExhibitionCarousel } from '@/components/exhibition-carousel';
import ReviewsSection from "@/components/reviews-section"; 
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '@/components/product-provider';
import { LoadingLogo } from '@/components/loading-logo';

// --- Enhanced Animation Constants ---
const sectionAnimation = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
};

const itemAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const titleContainerAnimation = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const characterAnimation = {
  initial: { opacity: 0, y: 40, rotateX: 90 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 1,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

export default function Home() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { bestsellers, isLoading: isProductsLoading } = useProducts();

  const displayedBestsellers = useMemo(() => 
    bestsellers.filter(p => p.material === 'Silver'), 
    [bestsellers]
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  if (isProductsLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-background">
          <LoadingLogo size={80} />
          <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Curating Collection...</p>
        </div>
      );
  }

  return (
    // CHANGED: gap-24 to gap-16 md:gap-24 to reduce spacing on mobile
    <div className="flex flex-col gap-16 md:gap-24 overflow-hidden bg-background text-foreground">
      
      {/* --- HERO SECTION --- */}
      <motion.section 
        className="w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Carousel
          setApi={setCarouselApi}
          opts={{ loop: true, duration: 60 }}
          plugins={[
            Autoplay({
              delay: 6000,
              stopOnInteraction: false,
            }),
          ]}
          // CHANGED: h-screen to h-[100dvh] for better mobile browser support
          className="w-full h-[100dvh] md:h-[95vh]"
          data-ai-hint="hero slider"
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              // CHANGED: Adjusted height for mobile
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
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none px-4">
            <div className="mb-6 overflow-hidden">
               <motion.div 
                 initial={{ y: "100%" }} 
                 animate={{ y: 0 }} 
                 transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                 className="inline-block px-3 py-1 border border-white/30 rounded-full bg-black/10 backdrop-blur-md"
               >
                 <span className="text-xs font-medium tracking-[0.2em] uppercase">Est. 2000 • Jaipur</span>
               </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={currentSlide}
                variants={titleContainerAnimation}
                initial="initial"
                animate="animate"
                exit="initial"
                // CHANGED: Text sizing for responsiveness (text-4xl for mobile)
                className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl flex flex-wrap justify-center overflow-hidden py-4 leading-[1.1] md:leading-[0.9] tracking-tight"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
              >
                {heroSlides[currentSlide]?.title.split("").map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    variants={characterAnimation}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h2>
            </AnimatePresence>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1, duration: 1 }}
              className="mt-6 text-sm md:text-base font-light tracking-wide max-w-xs md:max-w-md mx-auto opacity-90"
            >
              Timeless elegance handcrafted for the modern soul.
            </motion.p>
          </div>

          <div className="absolute bottom-20 right-90 hidden md:flex gap-3">
            <CarouselPrevious className="static translate-y-0 text-white bg-white/10 border-white/20 hover:bg-white hover:text-black hover:border-white transition-colors duration-300 rounded-full w-6 h-6" />
            <CarouselNext className="static translate-y-0 text-white bg-white/10 border-white/20 hover:bg-white hover:text-black hover:border-white transition-colors duration-300 rounded-full w-6 h-6" />
          </div>
        </Carousel>
      </motion.section>

      {/* --- CATEGORIES SECTION --- */}
      {/* CHANGED: px-40 to responsive padding px-4 md:px-12 lg:px-40 */}
      <motion.section className="container mx-auto px-4 md:px-12 lg:px-40" data-ai-hint="shop by category" {...sectionAnimation}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-3">Explore</span>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl tracking-tight">Shop by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {silverCategories.map((category) => (
              <Link href={`/category/${encodeURIComponent(category.name)}`} key={category.name}>
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        {/* CHANGED: Text size for mobile */}
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
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 px-2">
              <div className="text-center md:text-left w-full md:w-auto">
                <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-3">Curated For You</span>
                <h2 className="font-headline text-3xl md:text-5xl tracking-tight mb-2">Our Bestsellers</h2>
                <p className="text-muted-foreground font-light text-sm md:text-base">Timeless silver pieces, handcrafted with love</p>
              </div>
              <div className="hidden md:flex gap-2">
                {/* Custom Navigation Placeholders if needed */}
              </div>
            </div>
            
            {isProductsLoading ? (
               <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
               </div>
            ) : displayedBestsellers && displayedBestsellers.length > 0 ? (
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
                    {displayedBestsellers.slice(0, 8).map((product) => (
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
      
      {/* --- ABOUT SECTION --- */}
      <motion.section
        className="container mx-auto px-4 md:px-6 py-12"
        data-ai-hint="introduction section"
        {...sectionAnimation}
      >
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">

          {/* IMAGE */}
          <motion.div className="relative group order-2 md:order-1" {...itemAnimation}>
            <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl aspect-[4/5]">
              <Image
                src="https://i.ibb.co/xPFRtDC/imgi-8-AG0il-Szzl-Il40-s-Vwin-ZVT8-T3h0v-Un8dpsf-Ir-Fnn-Qs-Nh-FUQ9d9q-C5x-ZK-bwv-Nj46gy-WVzvx-AA87g-G.png"
                alt="Hawa Mahal in Jaipur"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            <div className="absolute -bottom-6 -left-6 w-2/3 h-2/3 border border-primary/20 rounded-bl-3xl -z-0 hidden md:block" />
          </motion.div>

          {/* CONTENT */}
          <motion.div className="order-1 md:order-2" {...itemAnimation}>
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-4">
              Our Heritage
            </span>

            {/* CHANGED: Text sizing for mobile */}
            <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl mb-8 tracking-tight leading-[1.15]">
              <span className="text-primary italic">
                Khushi Gems & Jewels
              </span>{" "}
              – A Legacy of Jaipur&apos;s Timeless Craftsmanship
            </h2>

            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed font-light">

              <p>
                Rooted in the heart of the Old Pink City,{" "}
                <span className="font-semibold text-foreground">
                  Khushi Gems & Jewels
                </span>{" "}
                stands as a proud custodian of Jaipur&apos;s rich jewellery heritage.
                With over{" "}
                <span className="relative font-semibold text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-primary/40">
                  25 years of excellence
                </span>
                , our journey began in Johari Bazar, near the iconic Hawa Mahal, where{" "}
                <span className="relative font-semibold text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-primary/40">
                  artistry, culture, and craftsmanship
                </span>{" "}
                come together to create jewellery that transcends time.
              </p>

              <p>
                Every creation reflects the soul of Rajasthan—its regal history,
                intricate architecture, vibrant colours, and royal traditions.{" "}
                <span className="relative font-semibold text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-primary/40">
                  Inspired by the grandeur of Rajasthani culture and the timeless beauty
                  of Jaipur
                </span>
                , our designs celebrate heritage while embracing contemporary elegance.
              </p>

              <div className="pt-4">
                <Button
                  variant="link"
                  asChild
                  className="p-0 text-base font-bold text-foreground group"
                >
                  <Link href="/about" className="flex items-center gap-2">
                    Read Our Story
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* --- MARQUEE --- */}
      <motion.section className="py-2 bg-black text-beige my-0" data-ai-hint="dynamic banner" {...sectionAnimation}>
        <Marquee baseVelocity={-2}>
             <span className="font-headline text-lg md:text-2xl mx-4">Khushi Gems and Jewellery</span>
             <span className="font-headline text-lg md:text-2xl mx-4">Handcrafted Bridal jewellery</span>
             <span className="font-headline text-lg md:text-2xl mx-4">Jaipur-Based Artisan</span>
        </Marquee>
      </motion.section>
      
      {/* --- EXHIBITIONS SECTION --- */}
      <motion.section id="exhibitions" className="w-full bg-secondary/50 py-16 md:py-32" data-ai-hint="exhibitions and collections" {...sectionAnimation}>
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-screen-2xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                      <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-3">Experience</span>
                      <h2 className="font-headline text-3xl md:text-5xl tracking-tight">Exhibitions</h2>
                  </div>
                  
                  <ExhibitionCarousel collections={collections} />
                  
                   <div className="text-center mt-12 md:mt-16">
                      <Button variant="outline" className="border-foreground/20 bg-transparent hover:bg-foreground hover:text-background rounded-full px-8 py-6 text-xs uppercase tracking-widest w-full md:w-auto" asChild>
                          <Link href="/collections">View All Collections</Link>
                      </Button>
                  </div>
              </div>
          </div>
      </motion.section>
      
      <ReviewsSection />
      
      {/* --- INSTAGRAM SECTION --- */}
      <motion.section className="bg-secondary/50 py-16 md:py-32 border-t border-border/40" data-ai-hint="instagram feed" {...sectionAnimation}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-12">
               <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/30 mb-6">
                  <Instagram className="h-6 w-6 text-foreground" />
               </div>
              {/* CHANGED: Text sizing for mobile */}
              <h2 className="font-headline text-3xl md:text-5xl mb-3 tracking-tight break-all md:break-normal">@khushijewelssilver</h2>
              <p className="text-muted-foreground tracking-wide text-sm md:text-base">Follow our journey on Instagram</p>
            </div>

            <div className="py-8">
              <ImageMarquee baseVelocity={-1}>
                  {silverInstagramPosts.map((post) => (
                      <Link href={post.slug} key={post.id} target="_blank" rel="noopener noreferrer">
                      {/* CHANGED: Adjusted width for mobile to prevent too large blocks */}
                      <div className="relative aspect-square w-56 md:w-80 overflow-hidden rounded-sm group mx-3 bg-gray-100">
                        <Image
                          src={post.imageUrl}
                          alt="Instagram post"
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          data-ai-hint={post.imageHint}
                        />
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