"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { useCart } from "./cart-provider";
import { Plus, Heart, MessageCircle } from "lucide-react";
import { useWishlist } from "./wishlist-provider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const router = useRouter();
  
  const inWishlist = product.id ? isItemInWishlist(product.id) : false;

  const productSlug = product.slug 
    ? product.slug 
    : product.name 
      ? product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
      : 'product';

  const displayPrice = typeof product.price === 'number' 
    ? product.price.toLocaleString() 
    : parseFloat(String(product.price || 0)).toLocaleString();

  const mainImage = (product.imageUrls && product.imageUrls.length > 0) 
    ? product.imageUrls[0] 
    : product.imageUrl || '/placeholder-image.jpg';

  // --- CHANGED LOGIC START ---
  // Hide price if priceOnRequest is true, OR if it's Gold (and not overridden)
  // We prefer the explicit flag, but default to Gold behavior if logic dictates
  const isQueryForRate = product.priceOnRequest === true; 

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    
    // Add item to cart
    addItem(product);
    
    // Redirect directly to checkout page
    router.push('/checkout'); 
  };

  const handleQueryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi, I'm interested in ${product.name}. Can you please tell me the current rate?`;
    window.open(`https://wa.me/919928070606?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card className="group w-full overflow-hidden border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/products/${productSlug}`}>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product.name || 'Product Image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              )}
            </div>
          </Link>
          
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
             <Button 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleWishlistClick} 
              aria-label={`Add ${product.name} to wishlist`}
              variant="secondary"
            >
              <Heart className={cn("h-4 w-4", inWishlist ? "fill-destructive text-destructive" : "text-foreground")} />
            </Button>

            {/* If Query Mode: Show WhatsApp. Else: Show Add to Cart */}
            {isQueryForRate ? (
                <Button 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleQueryClick}
                  aria-label="Query for Rate on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4"/>
                </Button>
            ) : (
                <Button 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => addItem(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <Plus className="h-4 w-4"/>
                </Button>
            )}
          </div>

           <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {!isQueryForRate && product.availability === 'READY TO SHIP' && (
              <div className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                Ready to Ship
              </div>
            )}
            {!isQueryForRate && product.availability === 'MADE TO ORDER' && (
              <div className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                Made to Order
              </div>
            )}
             {isQueryForRate && (
              <div className="rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                Query Rate
              </div>
            )}
          </div>

        </div>
        <div className="mt-3 text-left">
          <Link href={`/products/${productSlug}`}>
            <h3 className="font-semibold text-base truncate">{product.name}</h3>
          </Link>
          {/* Hide Price if Query Mode */}
          {isQueryForRate ? (
             <p className="text-sm font-semibold text-green-700 mt-1 flex items-center gap-1">
               <MessageCircle className="h-3 w-3" /> Rate on Request
             </p>
          ) : (
             <p className="text-sm text-muted-foreground mt-1">₹{displayPrice}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}