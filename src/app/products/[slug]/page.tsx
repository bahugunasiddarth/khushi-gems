"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Heart, Plus, Minus, ChevronRight, MessageCircle } from "lucide-react";
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
import { collection, getDocs } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

// ... (keep generateSlug, Breadcrumbs, sectionAnimation logic) ...

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

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
  const rawSlug = params?.slug;
  const slug = decodeURIComponent(Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug || ""));

  const { addItem } = useCart();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const { products: allProducts, isLoading: isContextLoading } = useProducts();

  const contextProduct = useMemo(() => {
    if (!slug) return undefined;
    return allProducts.find((p) => p.slug === slug);
  }, [allProducts, slug]);

  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [isDirectLoading, setIsDirectLoading] = useState(true);

  useEffect(() => {
    if (!slug || contextProduct) {
        setIsDirectLoading(false);
        return;
    }
    if (isContextLoading) return;

    const fetchAndFindProduct = async () => {
        // ... (Keep existing fetch logic) ...
        // Ensure manual fetch also checks for priceOnRequest in the data object construction
         try {
            const { firestore } = initializeFirebase();
            const productsRef = collection(firestore, 'products');
            const bestsellersRef = collection(firestore, 'bestsellers');
            
            const [productsSnap, bestsellersSnap] = await Promise.all([
                getDocs(productsRef),
                getDocs(bestsellersRef)
            ]);
            
            const checkSnapshot = (snapshot: any, fromBestseller: boolean) => {
                for (const doc of snapshot.docs) {
                    const data = doc.data();
                    const dbSlug = data.slug || generateSlug(data.name || '');
                    if (dbSlug === slug) {
                        return { doc, data, isBestseller: fromBestseller };
                    }
                }
                return null;
            };

            const match = checkSnapshot(productsSnap, false) || checkSnapshot(bestsellersSnap, true);

            if (match) {
                const { doc: foundDoc, data: foundData, isBestseller } = match;
                const productData: any = {
                    id: foundDoc.id,
                    name: foundData.name,
                    price: Number(foundData.price) || 0,
                    slug: slug, 
                    description: foundData.description || '',
                    category: foundData.category || 'Uncategorized',
                    material: foundData.material || (foundData.type?.toLowerCase().includes('gold') ? 'Gold' : 'Silver'),
                    availability: foundData.availability || 'READY TO SHIP',
                    stockQuantity: Number(foundData.stockQuantity) || 0,
                    isBestseller: isBestseller,
                    tag: foundData.availability || 'READY TO SHIP',
                    images: [],
                    imageUrl: '',
                    priceOnRequest: foundData.priceOnRequest === true // Capture Flag
                };

                let images = [];
                if (Array.isArray(foundData.imageUrls) && foundData.imageUrls.length > 0) {
                     images = foundData.imageUrls.map((url: string) => ({ url, hint: foundData.name }));
                } else if (foundData.imageUrl) {
                     images = [{ url: foundData.imageUrl, hint: foundData.name }];
                }
                if(images.length === 0) images.push({ url: "https://placehold.co/600x400?text=No+Image", hint: "No Image" });
                productData.images = images;
                productData.imageUrl = images[0].url;

                setDirectProduct(productData as Product);
            }
        } catch (error) {
            console.error("Manual fetch error:", error);
        } finally {
            setIsDirectLoading(false);
        }
    };
    fetchAndFindProduct();
  }, [slug, contextProduct, isContextLoading]);

  const product = contextProduct || directProduct;
  const isLoading = isContextLoading || (isDirectLoading && !product);

  const [userSelectedImage, setUserSelectedImage] = useState<any>(null);
  const activeImage = userSelectedImage || (product?.images && product.images.length > 0 ? product.images[0] : null);

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [customSize, setCustomSize] = useState('');

  if (isLoading) return <div className="flex justify-center items-center h-screen"><LoadingLogo /></div>;
  if (!product || !activeImage) { notFound(); return null; }

  const inWishlist = isItemInWishlist(product.id);

  // --- CHANGED LOGIC START ---
  const isQueryForRate = product.priceOnRequest === true; 

  const handleQueryForRate = () => {
    const message = `Hi, I'm interested in buying ${product.name}. Can you please tell me the current rate?`;
    window.open(`https://wa.link/29gk8a?text=${encodeURIComponent(message)}`, '_blank');
  };
  // --- CHANGED LOGIC END ---

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) removeFromWishlist(product.id);
    else addToWishlist(product);
  };
  
  // (Keep handleAddToCart logic, but it won't be used if isQueryForRate is true)
  const handleAddToCart = () => {
    // ... existing logic ...
    let finalSize: string | undefined = undefined;
    if (product.category === 'Rings') {
      finalSize = size === 'Custom' ? customSize : size;
      if (!finalSize) {
        toast({ variant: "destructive", title: "Please select a size", description: "Select ring size first." });
        return;
      }
    }
    
    if (product.availability === 'MADE TO ORDER') {
       addItem(product, quantity, finalSize, 'MADE TO ORDER');
       toast({ title: "Added to Cart", description: `${quantity} x ${product.name} (Made to Order)` });
    } else {
       const rawStock = (product as any).stockQuantity;
       const currentStock = typeof rawStock === 'number' ? rawStock : Number(rawStock) || 0;
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

  const similarProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  const bestsellers = allProducts.filter(p => p.material === product.material && p.isBestseller).slice(0, 8);

  return (
<motion.div className="container mx-auto px-4 py-12 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Breadcrumbs product={product} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-6">
        
        <motion.div className="flex flex-col-reverse sm:flex-row gap-4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex sm:flex-col gap-2 justify-center sm:justify-start">
              {product.images.map((image, index) => (
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
                {/* UPDATED COMPONENT USAGE */}
                <ImageZoom 
                    src={activeImage.url} 
                    alt={product.name} 
                    imageHint={activeImage.hint} 
                    images={product.images} // Pass all images
                    onImageSelect={setUserSelectedImage} // Pass function to update state
                />
            </div>
        </motion.div>

        <motion.div className="flex flex-col" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-headline text-4xl md:text-5xl">{product.name}</h1>
          
          {/* PRICE SECTION: Hide if Query For Rate */}
          {isQueryForRate ? (
             <div className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-900">
               <p className="font-semibold flex items-center gap-2">
                 <MessageCircle className="h-5 w-5" /> 
                 Gold Rate Fluctuates Daily
               </p>
               <p className="text-sm mt-1">Please query via WhatsApp for the latest price.</p>
             </div>
          ) : (
             <p className="text-2xl mt-2 mb-4">₹{product.price.toLocaleString()}</p>
          )}

          <Separator className="my-4 bg-black/10" />
          
          {/* Availability Tag */}
          {!isQueryForRate && product.tag && (
            <div className={cn("flex items-center gap-2 text-sm font-semibold mb-6", product.tag === 'READY TO SHIP' ? "text-green-700" : "text-amber-600")}>
              <span className={cn("h-2 w-2 rounded-full", product.tag === 'READY TO SHIP' ? 'bg-green-700' : 'bg-amber-600')}></span>
              {product.tag}
            </div>
          )}
          
          <p className="text-base text-foreground/80 mb-6">{product.description}</p>

          {/* Ring Size Selection (Only show if NOT Query Rate? Or kept for specifics? Usually keep it to inform the query) */}
          {product.category === 'Rings' && (
            <div className="space-y-4 my-6">
               {/* ... (Keep Ring Size Selector) ... */}
               <div className="flex items-center justify-between max-w-sm">
                <Label htmlFor="ring-size" className="font-semibold">Ring Size</Label>
                 {/* ... (Dialog code) ... */}
              </div>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="max-w-sm"><SelectValue placeholder="Select a size" /></SelectTrigger>
                <SelectContent>{ringSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              {size === 'Custom' && (
                  <Input placeholder="Enter custom size" className="max-w-sm" value={customSize} onChange={(e) => setCustomSize(e.target.value)} />
              )}
            </div>
          )}
          
          {/* Quantity Selector - Hide if Query For Rate */}
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
          
          {/* Action Buttons */}
          <div className="flex gap-2 max-w-sm mt-4">
             {isQueryForRate ? (
                 <Button onClick={handleQueryForRate} size="lg" className="flex-grow bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg">
                    <MessageCircle className="mr-2 h-5 w-5" /> Query for Rate
                 </Button>
             ) : (
                 <Button onClick={handleAddToCart} size="lg" className="flex-grow">
                    Add to Cart
                 </Button>
             )}
             
             <Button variant="outline" onClick={handleWishlistClick} size="icon" className="px-4 h-12 w-12 flex-shrink-0">
                <Heart className={cn("h-6 w-6", inWishlist && "fill-destructive text-destructive")} />
             </Button>
          </div>
          
           {/* ... (Keep Shipping Dialog) ... */}

        </motion.div>
      </div>
      
       {/* ... (Keep Carousel Sections) ... */}
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
    </motion.div>
  );
}