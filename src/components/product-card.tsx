"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { Button } from "./ui/button";
import { useCart } from "./cart-provider";
import { Plus, Heart } from "lucide-react";
import { useWishlist } from "./wishlist-provider";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  
  // SAFETY: Ensure we have an ID to check the wishlist
  const inWishlist = product.id ? isItemInWishlist(product.id) : false;

  // SAFETY: Generate a slug if it's missing
  const productSlug = product.slug 
    ? product.slug 
    : product.name 
      ? product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
      : 'product';

  // SAFETY: Handle price if it comes in as a string or number
  const displayPrice = typeof product.price === 'number' 
    ? product.price.toLocaleString() 
    : parseFloat(String(product.price || 0)).toLocaleString();

  // LOGIC: Use the first image from the array, or fallback
  const mainImage = (product.imageUrls && product.imageUrls.length > 0) 
    ? product.imageUrls[0] 
    : product.imageUrl || '/placeholder-image.jpg';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
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
            <Button 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => addItem(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="h-4 w-4"/>
            </Button>
          </div>

           {/* --- REVERTED UI STYLE, KEPT LOGIC --- */}
           <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {product.availability === 'READY TO SHIP' && (
              <div className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                Ready to Ship
              </div>
            )}
            {product.availability === 'MADE TO ORDER' && (
              <div className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
                Made to Order
              </div>
            )}
          </div>

        </div>
        <div className="mt-3 text-left">
          <Link href={`/products/${productSlug}`}>
            <h3 className="font-semibold text-base truncate">{product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">₹{displayPrice}</p>
        </div>
      </CardContent>
    </Card>
  );
}