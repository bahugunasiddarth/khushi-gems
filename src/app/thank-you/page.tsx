"use client";

import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { 
  CheckCircle2, 
  CalendarDays, 
  CreditCard, 
  ShoppingBag, 
  MapPin, 
  ArrowRight,
  PackageCheck,
  Truck
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Order, OrderItem } from '@/lib/types';
import { motion } from "framer-motion";
import { LoadingLogo } from '@/components/loading-logo';
import { calculateDeliveryRange } from "@/lib/delivery-utils";

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

  // Stagger animation for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
       <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
          <LoadingLogo size={80} />
          <p className="text-sm font-medium text-muted-foreground animate-pulse tracking-wide uppercase">Loading Order Details</p>
       </div>
    )
  }

  if (!order) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-full mb-6">
                <PackageCheck className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Order Not Found</h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                We were unable to locate this order. It may have been moved or the link is invalid.
            </p>
            <Button asChild variant="default" size="lg" className="rounded-full px-8">
                <Link href="/account">Return to Account</Link>
            </Button>
        </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-none shadow-2xl bg-card overflow-hidden rounded-3xl ring-1 ring-black/5">
        
        {/* === Header Section === */}
        <div className="relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-border/40 p-8 md:p-12 text-center">
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {isNewOrder && (
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto bg-emerald-500 text-white shadow-emerald-500/30 shadow-lg rounded-full h-20 w-20 flex items-center justify-center mb-8 relative z-10"
                >
                    <CheckCircle2 className="h-10 w-10" />
                </motion.div>
            )}
            
            <div className="relative z-10 space-y-4">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                    {isNewOrder ? "Order Confirmed" : "Order Details"}
                </h1>
                <p className="text-lg text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
                    {isNewOrder 
                        ? `Thank you for your purchase. We've received your order and are getting it ready.` 
                        : `Details for order #${order.id.substring(0, 7).toUpperCase()}`
                    }
                </p>
            </div>
        </div>

        <CardContent className="p-0">
          
          {/* === Meta Data Strip === */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-b border-border/40 bg-card">
              <div className="p-6 text-center group hover:bg-muted/20 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Order ID</p>
                  <p className="font-mono text-sm md:text-base font-semibold">#{order.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <div className="p-6 text-center group hover:bg-muted/20 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex justify-center items-center gap-1">
                      <CalendarDays className="w-3 h-3" /> Date
                  </p>
                  <p className="font-medium text-sm md:text-base">{new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</p>
              </div>
              <div className="p-6 text-center group hover:bg-muted/20 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex justify-center items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Payment
                  </p>
                  <p className="font-medium text-sm md:text-base capitalize">{order.paymentMethod}</p>
              </div>
              <div className="p-6 text-center group hover:bg-muted/20 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                      (order.status || order.orderStatus) === 'Delivered' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                      {order.status || order.orderStatus}
                  </span>
              </div>
          </div>

          {/* === Main Content Area === */}
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Items List */}
            <div className="space-y-6">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold tracking-tight">Purchased Items</h3>
                    <span className="text-sm text-muted-foreground">{orderItems?.length || 0} items</span>
                </div>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {orderItems && orderItems.map((item) => {
                      const orderDate = new Date(order.orderDate.seconds * 1000);
                      // Use optional chaining and a fallback for older orders
                      const delivery = calculateDeliveryRange({ availability: item.status || 'READY TO SHIP' }, orderDate);

                      return (
                        <motion.div 
                            key={item.id} 
                            variants={itemVariants}
                            className="group flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-transparent hover:border-border hover:bg-secondary/30 transition-all duration-300"
                        >
                            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            
                            <div className="flex-1 text-center sm:text-left space-y-1">
                                <h4 className="font-bold text-lg leading-tight">{item.name}</h4>
                                <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                                    <span className="bg-secondary px-2.5 py-0.5 rounded-md font-medium text-secondary-foreground">Qty: {item.quantity}</span>
                                    {item.size && <span>Size: {item.size}</span>}
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground pt-1">
                                    <Truck className="h-3 w-3" />
                                    <span>Est. Delivery: {delivery.estimatedRange}</span>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <p className="font-bold text-lg">₹{(item.itemPrice * item.quantity).toLocaleString()}</p>
                                {item.quantity > 1 && (
                                    <p className="text-xs text-muted-foreground">₹{item.itemPrice.toLocaleString()} each</p>
                                )}
                            </div>
                        </motion.div>
                      );
                    })}
                </motion.div>
                
                {/* Total Calculation */}
                <div className="flex justify-end pt-8">
                    <div className="w-full max-w-xs space-y-4">
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-base text-muted-foreground">Subtotal</span>
                            <span className="text-base font-medium">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base text-muted-foreground">Shipping</span>
                            <span className="text-base font-medium text-green-600">Free</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-bold tracking-tight">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Billing Address</h4>
                    </div>
                    <div className="pl-12">
                        <address className="not-italic text-foreground/80 leading-7 text-base">
                            {order.billingAddress.split(',').map((line, i) => (
                                <div key={i}>{line.trim()}</div>
                            ))}
                        </address>
                    </div>
                </div>

                <div className="space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Shipping Address</h4>
                    </div>
                    <div className="pl-12">
                        <address className="not-italic text-foreground/80 leading-7 text-base">
                            {order.shippingAddress.split(',').map((line, i) => (
                                <div key={i}>{line.trim()}</div>
                            ))}
                        </address>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-8">
                <div className="bg-muted/30 rounded-2xl p-8 text-center space-y-6">
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                        Need help with this order? <Link href="/contact" className="underline hover:text-primary underline-offset-4">Contact Support</Link>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="w-full sm:w-auto rounded-full font-medium px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/20 transition-all">
                            <Link href="/">
                                Continue Shopping
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="w-full sm:w-auto rounded-full px-8 h-12 border-2 hover:bg-muted/50">
                            <Link href="/account" className="group">
                                View Order History 
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function OrderDetailsPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
                <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><LoadingLogo size={96} /></div>}>
                    <OrderDetailsContent />
                </Suspense>
            </div>
        </div>
    </div>
  );
}
