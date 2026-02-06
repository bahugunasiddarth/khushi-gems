import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, User } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function Footer() {
  const supportLinks = [
    { name: "Terms & Conditions", href: "/terms-conditions" },
    { name: "Returns & Exchanges", href: "/returns-exchanges" },
    { name: "Shipping & Delivery", href: "/shipping-delivery" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "FAQs", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Customer Reviews", href: "/#reviews" },
    { name: "Locations", href: "/location" },
    { name: "Blog", href: "/blog" },
  ];
  
  const accountLinks = [
    { name: "My Account", href: "/account" },
    { name: "Orders Tracking", href: "/track-order" },
  ];

  const contactPersons = [
    { name: "Anil kumar soni", phone: "+91 9928070606" },
    { name: "Priyansh soni", phone: "+91 7014533288" },
    { name: "Sunil kumar soni", phone: "+91 9829134725" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="font-headline text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:underline text-primary-foreground/90">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-1">
             <h3 className="font-headline text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:underline text-primary-foreground/90">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
             <h3 className="font-headline text-lg mb-4 mt-8">Account</h3>
            <ul className="space-y-2">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:underline text-primary-foreground/90">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-1">
              <h3 className="font-headline text-lg mb-4">Contact Us</h3>
              <div className="space-y-4 text-sm text-primary-foreground/90">
                  <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Khushi gems & Jewels</p>
                        <p>172, Badi Chopar, Mehandi Ka Chowk, Johri Bazar, Ramganj Bazar, Jaipur, Rajasthan 302003</p>
                      </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <div className="space-y-2">
                        {contactPersons.map((person, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="font-medium">{person.name}:</span>
                            <span className="text-primary-foreground/80">{person.phone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4" />
                        <a href="mailto:support@khushigemsjaipur.com" className="hover:underline">support@khushigemsjaipur.com</a>
                    </div>
                    <div className="flex items-center gap-3 ml-7">
                        <a href="mailto:anilsoni7104@gmail.com" className="hover:underline">anilsoni7104@gmail.com</a>
                    </div>
                  </div>
              </div>
              <div className="flex items-center space-x-4 mt-8">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:opacity-75" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:opacity-75" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:opacity-75" />
              </Link>
            </div>
          </div>
          <div className="md:col-span-1">
            <h3 className="font-headline text-lg mb-4">Subscribe to our query</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Get the latest updates on new products and upcoming sales.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-background border-primary-foreground/20 placeholder:text-muted-foreground" />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <Tabs defaultValue="support" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-primary-foreground/10">
              <TabsTrigger value="support" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Support</TabsTrigger>
              <TabsTrigger value="company" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Company</TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="support" className="mt-6">
              <ul className="space-y-3 text-center">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:underline text-primary-foreground/90">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="company" className="mt-6">
              <ul className="space-y-3 text-center">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:underline text-primary-foreground/90">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="account" className="mt-6">
              <ul className="space-y-3 text-center">
                {accountLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:underline text-primary-foreground/90">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
             <h3 className="font-headline text-lg mb-4 text-center">Contact Us</h3>
              <div className="space-y-4 text-sm text-primary-foreground/90 text-center">
                  <div className="flex flex-col items-center gap-1">
                      <MapPin className="h-5 w-5 mb-1" />
                      <div>
                        <p className="font-bold">Khushi gems & Jewels</p>
                        <p className="px-4">172, Badi Chopar, Mehandi Ka Chowk, Johri Bazar, Ramganj Bazar, Jaipur, Rajasthan 302003</p>
                      </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                      <User className="h-5 w-5" />
                      <div className="space-y-2">
                        {contactPersons.map((person, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <span className="font-medium">{person.name}</span>
                            <span className="text-primary-foreground/80">{person.phone}</span>
                          </div>
                        ))}
                      </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <Mail className="h-5 w-5 mb-1" />
                      <a href="mailto:support@khushigemsjaipur.com" className="hover:underline">support@khushigemsjaipur.com</a>
                      <a href="mailto:anilsoni7104@gmail.com" className="hover:underline">anilsoni7104@gmail.com</a>
                  </div>
              </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="font-headline text-lg mb-4">Subscribe</h3>
            <p className="text-sm text-primary-foreground/70 mb-4 max-w-xs mx-auto">
              Get the latest updates on new products and sales.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
              <Input type="email" placeholder="Email" className="bg-background border-primary-foreground/20 placeholder:text-muted-foreground text-foreground" />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </div>
          </div>
          
           <div className="flex items-center justify-center space-x-6 mt-12">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 hover:opacity-75" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 hover:opacity-75" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 hover:opacity-75" />
              </Link>
            </div>
        </div>

         <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/70">
          <p>&copy; {new Date().getFullYear()} Khushi Gems and Jewellery. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}