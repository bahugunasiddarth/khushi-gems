"use client";

import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { 
  CheckCircle2, 
  CalendarDays, 
  CreditCard, 
  MapPin, 
  Package,
  Truck,
  Download,
  Receipt,
  Clock,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Order, OrderItem } from '@/lib/types';
import { motion } from "framer-motion";
import { LoadingLogo } from '@/components/loading-logo';
import { calculateDeliveryRange } from "@/lib/delivery-utils";
import { Badge } from "@/components/ui/badge";

// Helper for status colors
const getStatusColor = (status: string = 'Processing') => {
  const s = status.toLowerCase();
  if (s.includes('deliver') || s.includes('complete')) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  if (s.includes('ship') || s.includes('dispatch')) return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  if (s.includes('cancel')) return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
  return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
};

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const isNewOrder = searchParams.get('new') === 'true';
  const { user } = useUser();
  const firestore = useFirestore();

  const orderDocRef = useMemoFirebase(() => {
    if (!firestore || !user || !orderId) return null;
    return doc(firestore, 'users', user.uid, 'orders', orderId);
  }, [firestore, user, orderId]);

  const { data: order, isLoading: isOrderLoading } = useDoc<Order>(orderDocRef);

  const orderItemsQuery = useMemoFirebase(() => {
    if (!orderDocRef) return null;
    return collection(orderDocRef, 'orderItems');
  }, [orderDocRef]);

  const { data: orderItems, isLoading: areItemsLoading } = useCollection<OrderItem>(orderItemsQuery);

  const isLoading = isOrderLoading || areItemsLoading;

  if (isLoading) {
    return (
       <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
          <LoadingLogo size={60} />
          <p className="text-xs font-medium text-muted-foreground animate-pulse tracking-widest uppercase">Fetching Order...</p>
       </div>
    )
  }

  if (!order) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="bg-muted p-6 rounded-full">
                <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Order Not Found</h2>
                <p className="text-muted-foreground">We couldn't locate this order.</p>
            </div>
            <Button asChild variant="default" className="rounded-full px-8">
                <Link href="/account">Back to Orders</Link>
            </Button>
        </div>
    )
  }

  const orderStatus = order.status || order.orderStatus || 'Processing';
  const statusColorClass = getStatusColor(orderStatus);

  // --- Tax Calculation Logic ---
  // Assuming order.totalAmount is the final amount paid.
  // We back-calculate the subtotal before the 3% tax was applied.
  // Formula: Total = Subtotal * 1.03  =>  Subtotal = Total / 1.03
  const taxRate = 0.03;
  const subtotalAmount = order.totalAmount / (1 + taxRate);
  const taxAmount = order.totalAmount - subtotalAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* === Page Header === */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.substring(0, 8).toUpperCase()}</h1>
             <Badge variant="outline" className={`capitalize border ${statusColorClass} px-3 py-0.5 shadow-sm`}>
                {orderStatus === 'Processing' && <span className="mr-1.5 flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>}
                {orderStatus}
             </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {new Date(order.orderDate.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(order.orderDate.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
           {isNewOrder && (
               <Button asChild variant="default" size="sm" className="gap-2 text-white">
                 <Link href="/">
                    <CheckCircle2 className="w-4 h-4" /> Continue Shopping
                 </Link>
               </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* === LEFT COLUMN: Products (8 cols) === */}
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/40 bg-muted/20 flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" /> 
                        Items in Shipment
                        <span className="text-muted-foreground font-normal ml-1">({orderItems?.length || 0})</span>
                    </h3>
                </div>
                
                <div className="divide-y divide-border/40">
                    {orderItems && orderItems.map((item) => {
                        const orderDate = new Date(order.orderDate.seconds * 1000);
                        const delivery = calculateDeliveryRange({ availability: item.status || 'READY TO SHIP' }, orderDate);

                        return (
                            <div key={item.id} className="p-6 group hover:bg-muted/30 transition-colors">
                                <div className="flex gap-4 sm:gap-6">
                                    {/* Product Image */}
                                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-lg border border-border/60 bg-white overflow-hidden shrink-0">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    
                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-base leading-tight text-foreground line-clamp-2">{item.name}</h4>
                                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                    {item.size && <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">Size: {item.size}</span>}
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border text-xs">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <p className="font-medium tabular-nums text-right">
                                                ₹{(item.itemPrice * item.quantity).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground/80 bg-secondary/30 w-fit px-3 py-1.5 rounded-full">
                                            <Truck className="h-3.5 w-3.5 text-blue-500" />
                                            <span>Est. Delivery: <span className="text-foreground font-medium">{delivery.estimatedRange}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* === Need Help Section (Black Theme) === */}
            <div className="bg-zinc-900 text-zinc-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-800 rounded-full shrink-0">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-bold text-lg tracking-tight">Need help with your order?</h4>
                        <p className="text-sm text-zinc-400">If you have any issues with delivery or the product, let us know.</p>
                    </div>
                </div>
                <Button variant="secondary" size="default" asChild className="bg-white text-black hover:bg-zinc-200 border-none font-medium px-6 shrink-0">
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </div>
        </div>

        {/* === RIGHT COLUMN: Summary (Sticky) (4 cols) === */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Summary Card */}
            <div className="bg-card border border-border/60 rounded-xl shadow-lg shadow-black/5 overflow-hidden">
                <div className="p-5 border-b border-border/40 bg-muted/40">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-primary" /> Order Summary
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="text-foreground tabular-nums">₹{subtotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Shipping</span>
                            <span className="text-emerald-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax (3% GST)</span>
                            <span className="text-foreground tabular-nums">₹{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    
                    <Separator className="bg-border/60" />
                    
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-base">Total</span>
                        <span className="font-bold text-xl tabular-nums tracking-tight">₹{order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="pt-2">
                        <div className="bg-secondary/40 rounded-lg p-3 flex items-center gap-3 text-sm border border-border/50">
                            <div className="bg-background p-1.5 rounded-md shadow-sm">
                                <CreditCard className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Payment Method</p>
                                <p className="capitalize font-medium">{order.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Card */}
            <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border/40 bg-muted/40">
                    <h3 className="font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Delivery Details
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            Shipping Address
                        </h4>
                        <div className="text-sm leading-relaxed pl-1 border-l-2 border-primary/20">
                            {order.shippingAddress.split(',').map((line, i) => (
                                <div key={i} className="text-foreground/90">{line.trim()}</div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            Billing Address
                        </h4>
                         <div className="text-sm leading-relaxed pl-1 border-l-2 border-muted">
                            {order.billingAddress.split(',').map((line, i) => (
                                <div key={i} className="text-muted-foreground">{line.trim()}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-1 gap-3">
                 <Button asChild variant="outline" className="w-full justify-between group h-11 rounded-xl">
                    <Link href="/account">
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">Order History</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </Button>
            </div>

        </div>
      </div>
    </motion.div>
  )
}

export default function OrderDetailsPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-6xl mx-auto">
                <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><LoadingLogo size={60} /></div>}>
                    <OrderDetailsContent />
                </Suspense>
            </div>
        </div>
    </div>
  );
}   