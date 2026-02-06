"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useProducts } from "@/components/product-provider";
import { ringSizes } from "@/lib/data";
import { calculateDeliveryRange } from "@/lib/delivery-utils";
import { ProductCard } from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { ImageZoom } from "@/components/image-zoom";
import { cn } from "@/lib/utils";
import { Heart, Plus, Minus, ChevronRight, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductClientViewProps {
  product: Product;
  similarProducts?: Product[];
}

function Breadcrumbs({ product }: { product: Product }) {
  const categoryPath = product.material === 'Gold' 
    ? `/gold/${encodeURIComponent(product.category)}` 
    : `/category/${encodeURIComponent(product.category)}`;
    
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

export default function ProductClientView({ product, similarProducts = [] }: ProductClientViewProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const { bestsellers } = useProducts();

  // --- IMAGES LOGIC ---
  const images = product?.images || [];
  const [userSelectedImage, setUserSelectedImage] = useState<any>(null);
  const activeImage = userSelectedImage || (images.length > 0 ? images[0] : { url: "https://placehold.co/600x400?text=No+Image", hint: "No Image" });

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [customSize, setCustomSize] = useState('');

  if (!product) return null;

  const inWishlist = isItemInWishlist(product.id);
  const { estimatedRange } = calculateDeliveryRange(product);
  const isQueryForRate = product.priceOnRequest === true; 

  // --- FILTER BESTSELLERS BY MATERIAL ---
  // If viewing a Gold product, show Gold Bestsellers. If Silver, show Silver.
  const filteredBestsellers = bestsellers.filter(p => 
    p.material === product.material && p.id !== product.id
  );

  const handleQueryForRate = () => {
    const message = `Hi, I'm interested in ${product.name}. Can you please tell me the current rate?`;
    window.open(`https://wa.me/919928070606?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) removeFromWishlist(product.id);
    else addToWishlist(product);
  };
  
  const handleAddToCart = () => {
    let finalSize: string | undefined = undefined;
    if (product.category === 'Rings') {
      finalSize = size === 'Custom' ? customSize : size;
      if (!finalSize) {
        toast({ variant: "destructive", title: "Please select a size", description: "Select ring size first." });
        return;
      }
    }
    
    const rawStock = (product as any).stockQuantity;
    const currentStock = typeof rawStock === 'number' ? rawStock : Number(rawStock) || 0;
    
    if (product.availability === 'MADE TO ORDER') {
       addItem(product, quantity, finalSize, 'MADE TO ORDER');
       toast({ title: "Added to Cart", description: `${quantity} x ${product.name} (Made to Order)` });
    } else {
       if (quantity <= currentStock) {
           addItem(product, quantity, finalSize, 'READY TO SHIP');
           toast({ title: "Added to Cart", description: `${quantity} x ${product.name} (Ready to Ship)` });
       } else {
           const ready = currentStock;
           const made = quantity - currentStock;
           if (ready > 0) addItem(product, ready, finalSize, 'READY TO SHIP');
           if (made > 0) addItem(product, made, finalSize, 'MADE TO ORDER');
           toast({ title: "Order Split", description: `Split: ${ready} In Stock, ${made} Made to Order` });
       }
    }
  };

  return (
    <motion.div className="container mx-auto px-4 py-12 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Breadcrumbs product={product} />
      
      {/* PRODUCT LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-6">
        <motion.div className="flex flex-col-reverse sm:flex-row gap-4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex sm:flex-col gap-2 justify-center sm:justify-start">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={cn("relative h-16 w-16 rounded-md overflow-hidden ring-2 ring-transparent transition shrink-0", activeImage.url === image.url && "ring-primary")}
                  onClick={() => setUserSelectedImage(image)}
                >
                  <Image src={image.url} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1">
                <ImageZoom src={activeImage.url} alt={product.name} imageHint={activeImage.hint} images={images} onImageSelect={setUserSelectedImage} />
            </div>
        </motion.div>

        <motion.div className="flex flex-col" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-headline text-4xl md:text-5xl">{product.name}</h1>
          {isQueryForRate ? (
             <div className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-900">
               <p className="font-semibold flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Gold Rate Fluctuates Daily</p>
               <p className="text-sm mt-1">Please query via WhatsApp for the latest price.</p>
             </div>
          ) : (
             <p className="text-2xl mt-2 mb-4">₹{product.price.toLocaleString()}</p>
          )}
          <Separator className="my-4 bg-black/10" />
          
          {!isQueryForRate && product.tag && (
            <div className={cn("flex items-center gap-2 text-sm font-semibold mb-6", product.tag === 'READY TO SHIP' ? "text-green-700" : "text-amber-600")}>
              <span className={cn("h-2 w-2 rounded-full", product.tag === 'READY TO SHIP' ? 'bg-green-700' : 'bg-amber-600')}></span>
              {product.tag}
            </div>
          )}
          
          <p className="text-base text-foreground/80 mb-6">{product.description}</p>
          <div className="mb-6 p-4 border rounded-lg ">
            <p className="text-sm font-medium text-slate-900">Estimated Delivery: <span className="text-primary font-bold">{estimatedRange}</span></p>
            <p className="text-xs text-slate-500 mt-1">{product.availability === 'MADE TO ORDER' ? "*Handcrafted specially for you. Takes 25-28 days." : "*Dispatched within 24-48 hours. Takes 8-10 days."}</p>
          </div>

          {product.category === 'Rings' && (
            <div className="space-y-4 my-6">
               <div className="flex items-center justify-between max-w-sm">
                <Label htmlFor="ring-size" className="font-semibold">Ring Size</Label>
                 <Dialog>
                    <DialogTrigger asChild><Button variant="link" className="h-auto p-0 text-xs">Size Guide</Button></DialogTrigger>
                    <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]"><Image src="/size-guide.jpg" alt="Ring Size Guide" width={800} height={600} className="w-full h-auto" /></DialogContent>
                 </Dialog>
              </div>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="max-w-sm"><SelectValue placeholder="Select a size" /></SelectTrigger>
                <SelectContent>{ringSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              {size === 'Custom' && (<Input placeholder="Enter custom size" className="max-w-sm" value={customSize} onChange={(e) => setCustomSize(e.target.value)} />)}
            </div>
          )}
          
          {!isQueryForRate && (
            <div className="flex items-center gap-4 mb-4">
                <p className="font-semibold">Quantity:</p>
                <div className="flex items-center gap-2 border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
            </div>
          )}
          
          <div className="flex gap-2 max-w-sm mt-4">
             {isQueryForRate ? (
                 <Button onClick={handleQueryForRate} size="lg" className="flex-grow bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg"><MessageCircle className="mr-2 h-5 w-5" /> Query for Rate</Button>
             ) : (
                 <Button onClick={handleAddToCart} size="lg" className="flex-grow">Add to Cart</Button>
             )}
             <Button variant="outline" onClick={handleWishlistClick} size="icon" className="px-4 h-12 w-12 flex-shrink-0"><Heart className={cn("h-6 w-6", inWishlist && "fill-destructive text-destructive")} /></Button>
          </div>
        </motion.div>
      </div>
      
       {/* --- YOU MAY ALSO LIKE (FILTERED BY MATERIAL FROM SERVER) --- */}
       <motion.div className="mt-24" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-headline text-3xl text-center mb-8">You may also like</h2>
          {similarProducts.length > 0 ? (
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
          ) : (
             <p className="text-center text-muted-foreground">No similar {product.material} products found.</p>
          )}
      </motion.div>

      {/* --- OUR BESTSELLERS (FILTERED BY MATERIAL CLIENT SIDE) --- */}
      <motion.div className="mt-24 pb-12" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-headline text-3xl text-center mb-8">Our {product.material} Bestsellers</h2>
          {filteredBestsellers.length > 0 ? (
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                {filteredBestsellers.map((p) => (
                    <CarouselItem key={p.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                    <ProductCard product={p} />
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
          ) : (
             <p className="text-center text-muted-foreground">No bestsellers found in this category.</p>
          )}
      </motion.div>

    </motion.div>
  );
}