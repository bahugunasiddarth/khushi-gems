"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/components/cart-provider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { countries, indianStates } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth, errorEmitter, FirestorePermissionError, setDocumentNonBlocking } from "@/firebase";
import { doc, addDoc, collection, serverTimestamp, setDoc, writeBatch, increment } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { LoadingLogo } from "@/components/loading-logo";
import { motion, AnimatePresence } from "framer-motion";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
    </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  company: z.string().optional(),
  country: z.string().min(1, { message: "Country is required." }),
  streetAddress: z.string().min(1, { message: "Street address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  pinCode: z.string().min(1, { message: "PIN code is required." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  orderNotes: z.string().optional(),
  createAccountPassword: z.string().optional(),
  paymentMethod: z.enum(["card", "transfer"], {
    required_error: "You need to select a payment method.",
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
  shipToDifferentAddress: z.boolean().optional(),
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingCompany: z.string().optional(),
  shippingCountry: z.string().optional(),
  shippingStreetAddress: z.string().optional(),
  shippingApartment: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingPinCode: z.string().optional(),
  shippingPhone: z.string().optional(),
}).refine(data => {
    if (!data.shipToDifferentAddress) return true;
    return (
        data.shippingFirstName &&
        data.shippingLastName &&
        data.shippingCountry &&
        data.shippingStreetAddress &&
        data.shippingCity &&
        data.shippingState &&
        data.shippingPinCode
    )
}, {
    message: "Please fill out all required shipping fields.",
    path: ["shipToDifferentAddress"]
});


type CheckoutFormValues = z.infer<typeof formSchema>;

function CheckoutForm({ onPlaceOrder }: { onPlaceOrder: () => void }) {
  const [createAccount, setCreateAccount] = useState(false);
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc(userDocRef);
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema.refine(data => {
        if (createAccount && !user) { 
            return data.createAccountPassword && data.createAccountPassword.length >= 8;
        }
        return true;
    }, {
        message: "Password must be at least 8 characters long.",
        path: ["createAccountPassword"],
    })),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      country: "India",
      streetAddress: "",
      city: "",
      state: "",
      pinCode: "",
      phone: "",
      orderNotes: "",
      createAccountPassword: "",
      paymentMethod: "card",
      agreeToTerms: false,
      shipToDifferentAddress: false,
      shippingFirstName: "",
      shippingLastName: "",
      shippingCompany: "",
      shippingCountry: "India",
      shippingStreetAddress: "",
      shippingApartment: "",
      shippingCity: "",
      shippingState: "",
      shippingPinCode: "",
      shippingPhone: "",
    },
  });
  
  const savedValuesRef = useRef<CheckoutFormValues | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("checkoutForm");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        savedValuesRef.current = parsedData;
      } catch (e) {
        localStorage.removeItem("checkoutForm");
      }
    }
  }, [form]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = form.watch((value) => {
        if (JSON.stringify(value) === JSON.stringify(savedValuesRef.current)) {
            return;
        }
        savedValuesRef.current = value as CheckoutFormValues;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            localStorage.setItem('checkoutForm', JSON.stringify(value));
        }, 500);
    });

    return () => {
        subscription.unsubscribe();
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
  }, [form, form.watch]);

   useEffect(() => {
    if (userProfile) {
        const { billingAddress } = userProfile;
        form.reset({
            ...form.getValues(),
            email: userProfile.email || '',
            firstName: billingAddress?.firstName || userProfile.firstName || '',
            lastName: billingAddress?.lastName || userProfile.lastName || '',
            company: billingAddress?.company || '',
            streetAddress: billingAddress?.streetAddress || '',
            city: billingAddress?.city || '',
            state: billingAddress?.state || '',
            pinCode: billingAddress?.pinCode || '',
            country: billingAddress?.country || 'India',
            phone: billingAddress?.phone || '',
        });
    } else if (user) {
        const nameParts = user.displayName ? user.displayName.split(' ') : [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const currentValues = form.getValues();
        const resetValues: CheckoutFormValues = {
             ...currentValues,
             email: user.email || '',
             firstName: firstName,
             lastName: lastName,
        };
        form.reset(resetValues);
    }
  }, [userProfile, user, form]);

  async function onSubmit(values: CheckoutFormValues) {
    onPlaceOrder();
    if (!firestore || !auth) {
        toast({
            variant: "destructive",
            title: "Checkout Error",
            description: "Could not connect to the database. Please try again later.",
        });
        return;
    }

    let effectiveUser = user;

    if (!effectiveUser && values.createAccountPassword) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.createAccountPassword);
            effectiveUser = userCredential.user;
            await effectiveUser.getIdToken(true); 
            const userDocRef = doc(firestore, 'users', effectiveUser.uid);
            await setDoc(userDocRef, {
                id: effectiveUser.uid,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
            }, { merge: true });
            toast({ title: "Account created successfully!" });
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Account Creation Failed",
                description: error.message,
            });
            return;
        }
    }

    if (!effectiveUser) {
        toast({
            variant: "destructive",
            title: "Please log in",
            description: "You need to be logged in to place an order.",
        });
        return;
    }

    const gst = cartTotal * 0.03;
    const totalWithGst = cartTotal + gst;
    
    const billingAddressString = `${values.streetAddress}, ${values.city}, ${values.state} ${values.pinCode}, ${values.country}`;
    const shippingAddressString = values.shipToDifferentAddress 
        ? `${values.shippingStreetAddress}, ${values.shippingCity}, ${values.shippingState} ${values.shippingPinCode}, ${values.shippingCountry}`
        : billingAddressString;

    const orderData = {
        userId: effectiveUser.uid,
        orderDate: serverTimestamp(),
        totalAmount: totalWithGst,
        shippingAddress: shippingAddressString,
        billingAddress: billingAddressString,
        paymentMethod: values.paymentMethod,
        status: "Processing",
        customer: {
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
        }
    };

    try {
      const batch = writeBatch(firestore);
      const ordersCollectionRef = collection(firestore, 'users', effectiveUser.uid, 'orders');
      const newOrderRef = doc(ordersCollectionRef); 
      batch.set(newOrderRef, orderData);

      const orderItemsCollectionRef = collection(newOrderRef, 'orderItems');
      const stockUpdates: Record<string, number> = {};

      for (const item of cart) {
        const newItemRef = doc(orderItemsCollectionRef);
        const itemStatus = item.status || item.availability || 'READY TO SHIP';

        batch.set(newItemRef, {
          productId: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          itemPrice: item.price,
          size: item.size || null,
          status: itemStatus,
        });

        if (itemStatus === 'READY TO SHIP') {
            if (stockUpdates[item.id]) {
                stockUpdates[item.id] += item.quantity;
            } else {
                stockUpdates[item.id] = item.quantity;
            }
        }
      }

      for (const [productId, quantity] of Object.entries(stockUpdates)) {
          const productRef = doc(firestore, 'products', productId);
          batch.update(productRef, {
              stockQuantity: increment(-quantity)
          });
      }

      await batch.commit();

      const userDocRef = doc(firestore, 'users', effectiveUser.uid);
      const billingAddress = {
          firstName: values.firstName,
          lastName: values.lastName,
          company: values.company || '',
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          pinCode: values.pinCode,
          country: values.country,
          phone: values.phone,
      };
      
      setDocumentNonBlocking(userDocRef, {
          billingAddress,
      }, { merge: true });
      
      clearCart();
      localStorage.removeItem('checkoutForm');
      router.push(`/thank-you?orderId=${newOrderRef.id}&new=true`);

    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Order Failed",
            description: "Something went wrong. Please try again.",
        });
        throw error;
    }
  }
  
  const gst = cartTotal * 0.03;
  const totalWithGst = cartTotal + gst;

  return (
    <>
      <AnimatePresence>
        {form.formState.isSubmitting && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingLogo size={96} />
            <p className="text-lg font-semibold mt-4">Processing your order...</p>
            <p className="text-muted-foreground">Please do not refresh the page.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div>
               <h2 className="font-headline text-2xl mb-4">Billing Details</h2>
               
               {!user && (
                <>
                  <Button variant="outline" className="w-full mb-4">
                      <GoogleIcon className="mr-2 h-5 w-5" />
                      Continue with Google
                  </Button>

                  <div className="relative flex py-2 items-center mb-4">
                      <div className="flex-grow border-t border-black/10"></div>
                      <span className="flex-shrink mx-4 text-muted-foreground text-sm">OR</span>
                      <div className="flex-grow border-t border-black/10"></div>
                  </div>
                </>
              )}

                <div className="space-y-4">
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                 
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>

                 <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel>Company name (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                 )} />

                 <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem><FormLabel>Country / Region</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl><SelectContent>{countries.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="streetAddress" render={({ field }) => (
                    <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="House number and street name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>Town / City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>State</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger></FormControl><SelectContent>{indianStates.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="pinCode" render={({ field }) => (
                        <FormItem><FormLabel>PIN Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                  </div>
                  
                   <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   
                   {!user && (
                    <div className="flex items-center space-x-2 pt-4">
                        <Checkbox id="create-account" checked={createAccount} onCheckedChange={(c) => setCreateAccount(c as boolean)} />
                        <Label htmlFor="create-account">Create an account?</Label>
                    </div>
                   )}
                   
                  {createAccount && !user && (
                    <FormField control={form.control} name="createAccountPassword" render={({ field }) => (
                      <FormItem><FormLabel>Create account password *</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  )}

                 <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                      id="ship-to-different-address" 
                      checked={shipToDifferentAddress} 
                      onCheckedChange={(checked) => setShipToDifferentAddress(checked as boolean)} 
                  />
                  <Label htmlFor="ship-to-different-address" className="font-normal">Deliver to a different address?</Label>
                </div>

                {shipToDifferentAddress && (
                   <div className="space-y-4 pt-4">
                      <h3 className="font-headline text-xl mb-4">Shipping Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <FormField
                          control={form.control}
                          name="shippingFirstName"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                          <FormField
                          control={form.control}
                          name="shippingLastName"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                      </div>
                      <FormField
                          control={form.control}
                          name="shippingCompany"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Company name (optional)</FormLabel>
                              <FormControl>
                              <Input {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="shippingCountry"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Country / Region</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                  <SelectTrigger>
                                  <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {countries.map((c) => (
                                  <SelectItem key={`shipping-${c}`} value={c}>
                                      {c}
                                  </SelectItem>
                                  ))}
                              </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="shippingStreetAddress"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                              <Input placeholder="House number and street name" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="shippingApartment"
                          render={({ field }) => (
                          <FormItem>
                              <FormControl>
                              <Input placeholder="Apartment, suite, unit, etc. (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                          control={form.control}
                          name="shippingCity"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Town / City</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                          <FormField
                          control={form.control}
                          name="shippingState"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select a state" />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  {indianStates.map((s) => (
                                      <SelectItem key={`shipping-${s}`} value={s}>
                                      {s}
                                      </SelectItem>
                                  ))}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                          <FormField
                          control={form.control}
                          name="shippingPinCode"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>PIN Code</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                      </div>
                       <FormField
                          control={form.control}
                          name="shippingPhone"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Phone (optional)</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                   </div>
                )}


                <FormField
                  control={form.control}
                  name="orderNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notes about your order, e.g. special notes for delivery."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="font-headline text-2xl mb-4">Your Order</h2>
              <div className="space-y-4 border border-black/10 p-6 rounded-md">
                {cart.map((item) => (
                  // FIXED: Unique key here as well
                  <div key={`${item.id}-${item.size || ''}-${item.status || ''}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={item.imageUrl || "https://placehold.co/100x100?text=No+Image"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          data-ai-hint={`${item.imageHint}`}
                        />
                      </div>
                      <div>
                        <p className="font-bold">{item.name} <span className="font-normal">× {item.quantity}</span></p>
                        {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                        
                        {/* FIXED: Display correct status instead of static tag */}
                        {item.status ? (
                            <div className={cn("text-xs font-semibold mt-1 flex items-center gap-2", item.status === 'READY TO SHIP' ? "text-green-700" : "text-amber-600")}>
                                <span className={cn("h-2 w-2 rounded-full", item.status === 'READY TO SHIP' ? 'bg-green-700' : 'bg-amber-600')}></span>
                                {item.status}
                            </div>
                        ) : item.tag && (
                          <div className="flex items-center gap-2 text-xs text-green-700 font-semibold mt-1">
                            <span className="h-2 w-2 rounded-full bg-green-700"></span>
                            {item.tag}
                          </div>
                        )}
                        
                      </div>
                    </div>
                    <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                <Separator className="bg-black/10" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>₹{cartTotal.toLocaleString()}</p>
                  </div>
                   <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>Free shipping</p>
                  </div>
                  <div className="flex justify-between">
                    <p>GST (3%)</p>
                    <p>₹{gst.toLocaleString()}</p>
                  </div>
                  <Separator className="bg-black/10" />
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>₹{totalWithGst.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method Section */}
             <div>
              <h2 className="font-headline text-2xl mb-4">Payment</h2>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0 border border-black/10 p-4 rounded-md">
                          <FormControl><RadioGroupItem value="card" /></FormControl>
                          <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 border border-black/10 p-4 rounded-md">
                          <FormControl><RadioGroupItem value="transfer" /></FormControl>
                          <FormLabel className="font-normal">Direct Bank Transfer</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-black/10 p-4">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I have read and agree to the website <Link href="/terms-conditions" className="underline hover:text-foreground">terms and conditions</Link> *</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
            />

            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
              Place Order
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default function CheckoutPage() {
  const { cart, isCartLoaded } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const handlePlaceOrder = () => setIsPlacingOrder(true);
  
  if (!isCartLoaded) {
      return (
        <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[50vh] gap-4">
          <LoadingLogo size={96} />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 md:px-12 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-headline text-4xl mb-8 text-center">Checkout</h1>
      {cart.length === 0 && !isPlacingOrder ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <CheckoutForm onPlaceOrder={handlePlaceOrder} />
      )}
    </motion.div>
  );
}