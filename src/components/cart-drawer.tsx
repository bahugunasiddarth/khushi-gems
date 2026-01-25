"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-provider";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { cart, removeItem, increaseQuantity, decreaseQuantity, cartTotal, clearCart, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-[90vw] sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="font-headline text-2xl">Shopping Cart</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-grow px-6">
              <div className="flex flex-col gap-6 py-6">
                {cart.map((item) => (
                  // FIXED: Unique key includes status
                  <div key={`${item.id}-${item.size || ''}-${item.status || ''}`} className="flex gap-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || "https://placehold.co/100x100?text=No+Image"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        data-ai-hint={`${item.imageHint}`}
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <p className="font-bold">{item.name}</p>
                      {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                       <p className="text-sm font-semibold mt-1 mb-2">
                        ₹{item.price.toLocaleString()}
                      </p>
                      
                      {/* FIXED: Priority to Item Status (MTO/RTS) over Product Tag */}
                      {item.status ? (
                         <div className={cn("text-xs font-semibold mb-2 flex items-center gap-2", item.status === 'READY TO SHIP' ? "text-green-700" : "text-amber-600")}>
                            <span className={cn("h-2 w-2 rounded-full", item.status === 'READY TO SHIP' ? 'bg-green-700' : 'bg-amber-600')}></span>
                            {item.status}
                         </div>
                      ) : item.tag && (
                        <div className="flex items-center gap-2 text-xs text-green-700 font-semibold mb-2">
                          <span className="h-2 w-2 rounded-full bg-green-700"></span>
                          {item.tag}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => decreaseQuantity(item.id, item.size, item.status)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-5 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => increaseQuantity(item.id, item.size, item.status)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-transparent"
                      onClick={() => removeItem(item.id, item.size, item.status)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="p-6 bg-secondary/50 flex flex-col gap-4">
              <div className="space-y-2">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Taxes and shipping calculated at checkout.</p>
              </div>
              
               <div className="flex flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={() => setIsCartOpen(false)}>Checkout</Link>
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => {setIsCartOpen(false);}}>
                  Or continue shopping
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-muted-foreground mt-2">Find something beautiful to add.</p>
            <Button asChild className="mt-4">
              <Link href="/" onClick={() => setIsCartOpen(false)}>Start Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}