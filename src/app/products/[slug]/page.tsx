"use client";

import { useState, useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useProducts } from "@/components/product-provider";
import { ringSizes } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { ImageZoom } from "@/components/image-zoom";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/components/wishlist-provider";
import { Heart, Plus, Minus, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoadingLogo } from "@/components/loading-logo";


function Breadcrumbs({ product }: { product: Product }) {
  const categoryPath = product.material === 'Gold' ? `/gold/${encodeURIComponent(product.category)}` : `/category/${encodeURIComponent(product.category)}`;
  
  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      <Link href="/" className="hover:text-foreground">Home</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link href={categoryPath} className="hover:text-foreground">{product.category}</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <span className="text-foreground truncate">{product.name}</span>
    </nav>
  );
}

const sectionAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { addItem } = useCart();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  
  const { products: allProducts, isLoading } = useProducts();

  const product = useMemo(() => {
    return allProducts.find((p) => p.slug === slug);
  }, [allProducts, slug]);

  const [activeImage, setActiveImage] = useState(product?.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [customSize, setCustomSize] = useState('');
  
  useMemo(() => {
      if(product && product.images && product.images.length > 0) {
          setActiveImage(product.images[0]);
      }
  }, [product]);

  if (isLoading && !product) {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoadingLogo />
        </div>
    );
  }

  if (!product || !activeImage) {
    if (!isLoading) notFound();
    return null; 
  }

  const inWishlist = isItemInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = () => {
    let finalSize: string | undefined = undefined;
    if (product.category === 'Rings') {
      finalSize = size === 'Custom' ? customSize : size;
      if (!finalSize) {
        toast({
          variant: "destructive",
          title: "Please select a size",
          description: "You must select a ring size before adding to cart.",
        });
        return;
      }
    }

    if (product.availability === 'MADE TO ORDER') {
       addItem(product, quantity, finalSize, 'MADE TO ORDER');
       toast({
         title: "Added to Cart",
         description: `${quantity} x ${product.name} (Made to Order)`,
       });
    } else {
       const rawStock = (product as any).stockQuantity;
       const currentStock = typeof rawStock === 'number' ? rawStock : Number(rawStock) || 0;

       if (quantity <= currentStock) {
           addItem(product, quantity, finalSize, 'READY TO SHIP');
           toast({
            title: "Added to Cart",
            description: `${quantity} x ${product.name} (Ready to Ship)`,
          });
       } else {
           const readyToShipCount = currentStock;
           const madeToOrderCount = quantity - currentStock;

           if (readyToShipCount > 0) {
               addItem(product, readyToShipCount, finalSize, 'READY TO SHIP');
           }
           if (madeToOrderCount > 0) {
               addItem(product, madeToOrderCount, finalSize, 'MADE TO ORDER');
           }
           
           toast({
            title: "Order Split",
            description: `Only ${readyToShipCount} in stock. Remaining ${madeToOrderCount} added as Made to Order`,
          });
       }
    }
  };

  const similarProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 5);

  const bestsellers = allProducts
    .filter(p => p.material === product.material && p.isBestseller)
    .slice(0, 8);

  return (
    <motion.div 
      className="container mx-auto px-4 py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumbs product={product} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-6">
        
        <motion.div className="flex flex-col-reverse sm:flex-row gap-4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex sm:flex-col gap-2 justify-center sm:justify-start">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative h-16 w-16 rounded-md overflow-hidden ring-2 ring-transparent transition shrink-0",
                    activeImage.url === image.url && "ring-primary"
                  )}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    data-ai-hint={image.hint}
                  />
                </button>
              ))}
            </div>
            <div className="relative flex-1">
                <ImageZoom src={activeImage.url} alt={product.name} imageHint={activeImage.hint} />
            </div>
        </motion.div>

        <motion.div className="flex flex-col" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-headline text-4xl md:text-5xl">{product.name}</h1>
          <p className="text-2xl mt-2 mb-4">₹{product.price.toLocaleString()}</p>
          <Separator className="my-4 bg-black/10" />
          
          {/* --- UPDATED STATUS INDICATOR --- */}
          {product.tag && (
            <div className={cn("flex items-center gap-2 text-sm font-semibold mb-6", product.tag === 'READY TO SHIP' ? "text-green-700" : "text-amber-600")}>
              <span className={cn("h-2 w-2 rounded-full", product.tag === 'READY TO SHIP' ? 'bg-green-700' : 'bg-amber-600')}></span>
              {product.tag}
            </div>
          )}
          
          {(product as any).stockQuantity !== undefined && product.availability === 'READY TO SHIP' && (
             <p className="text-sm text-muted-foreground mb-2">Current Stock: {(product as any).stockQuantity}</p>
          )}

          <p className="text-base text-foreground/80 mb-6">
            {product.description}
          </p>

          {product.category === 'Rings' && (
            <div className="space-y-4 my-6">
              <div className="flex items-center justify-between max-w-sm">
                <Label htmlFor="ring-size" className="font-semibold">Ring Size</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sm text-muted-foreground hover:text-foreground underline">
                      Check Size Guide
                    </button>
                  </DialogTrigger>
                   <DialogContent className="sm:max-w-[90vw] md:max-w-[75vw] lg:max-w-4xl">
                     <div className="p-4 text-center">Size Guide Image</div>
                   </DialogContent>
                </Dialog>
              </div>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="ring-size" className="max-w-sm">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {ringSizes.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {size === 'Custom' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="custom-ring-size">Enter custom size</Label>
                  <Input 
                    id="custom-ring-size" 
                    placeholder="e.g. 5 1/8"
                    className="max-w-sm"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                  />
                </motion.div>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-4">
            <p className="font-semibold">Quantity:</p>
            <div className="flex items-center gap-2 border rounded-md">
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 max-w-sm">
             <Button onClick={handleAddToCart} size="lg" className="flex-grow">
                Add to Cart
             </Button>
             <Button variant="outline" onClick={handleWishlistClick} size="icon" className="px-4 h-12 w-12 flex-shrink-0">
                <Heart className={cn("h-6 w-6", inWishlist && "fill-destructive text-destructive")} />
                <span className="sr-only">Add to wishlist</span>
             </Button>
          </div>
          
           <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-muted-foreground hover:text-foreground underline mt-4 text-left w-fit">
                  Shipping &amp; returns
                </button>
              </DialogTrigger>
               <DialogContent>
                 <div className="p-4">Shipping policies...</div>
               </DialogContent>
            </Dialog>

        </motion.div>
      </div>
      
       <motion.div className="mt-24" {...sectionAnimation}>
        <h2 className="font-headline text-3xl text-center mb-8">You may also like</h2>
        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {similarProducts.map((p) => (
              <CarouselItem key={p.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                <ProductCard product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
           <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </motion.div>

      {bestsellers.length > 0 && (
          <motion.div className="mt-24" {...sectionAnimation}>
            <h2 className="font-headline text-3xl text-center mb-8">Bestsellers</h2>
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {bestsellers.map((p) => (
                  <CarouselItem key={p.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                    <ProductCard product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </motion.div>
      )}
    </motion.div>
  );
}