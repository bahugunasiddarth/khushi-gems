import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/components/cart-provider';
import { WishlistProvider } from '@/components/wishlist-provider';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ProductProvider } from '@/components/product-provider';

// 1. STRONG SEO METADATA (UPDATED)
export const metadata: Metadata = {
  metadataBase: new URL('https://www.khushigemsjaipur.com'),
  title: {
    default: 'Khushi Gems and Jewels | Best Jewellery Shop in Jaipur', 
    template: '%s | Khushi Gems and Jewels - Top Jewellery Store' 
  },
  description:
    'Khushi Gems and Jewels is the best jewellery shop in Jaipur, located in Johari Bazar. We are trusted manufacturers of authentic Gems, Gold, Silver, and Kundan Meena jewellery.', 
  keywords: [
    'Khushi Gems and Jewels', 
    'Khushi Gems and Jewels Jaipur',
    'Khushi Gems and Jewellery', 
    'Best Jewellery Shop in Jaipur',
    'Best Gems in Jaipur',
    'Original Gemstones Jaipur',
    'Gold Ring Price in Jaipur',
    'Best Silver Jewellery in Jaipur',
    'Johari Bazar Jewellery Shop'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.khushigemsjaipur.com',
    siteName: 'Khushi Gems and Jewels', 
    title: 'Khushi Gems and Jewels | Best Jewellery Shop in Jaipur',
    description:
      'Buy authentic Jaipur jewellery from Khushi Gems and Jewels. Gold, Silver & Kundan Meena jewellery with worldwide delivery.',
    images: [
      {
        url: '/khushigems.png',
        width: 1200,
        height: 630,
        alt: 'Khushi Gems and Jewels Jaipur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khushi Gems Jaipur',
    description: 'Authentic Handcrafted Jewellery from Jaipur.',
    images: ['/khushigems.png'],
  },
  verification: {
    google: 'xHMsbyJ2-uc3T1yWgNct959PHdHFVHxcoPaEk3IS5AA',
  },
  icons: {
    icon: '/favicon.ico', 
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />

        {/* 2. ADVANCED JSON-LD SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              // SCHEMA A: The Local Jewelry Store
              {
                "@context": "https://schema.org",
                "@type": "JewelryStore",
                "name": "Khushi Gems and Jewels",
                "alternateName": "Khushi Gems and Jewellery",
                "knowsAbout": ["Gemstones", "Silver Jewellery", "Gold Jewellery", "Kundan Meena", "Authentic Gems"],
                "image": "https://www.khushigemsjaipur.com/khushigems.png",
                "description": "Trusted jewellery store in Johari Bazar, Jaipur offering Gold, Silver, Kundan Meena and traditional Rajasthani jewellery.",
                "url": "https://www.khushigemsjaipur.com",
                "telephone": "+919928070606",
                "priceRange": "₹500 - ₹25,00,000",
                "currenciesAccepted": "INR, USD, EUR, GBP",
                "paymentAccepted": "Credit Card, UPI, Bank Transfer, PayPal",
                "hasMap": "https://maps.app.goo.gl/DStu2GhfwRfcMWAt9", 
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "172, Badi Chopar, Mehandi Ka Chowk, Johri Bazar",
                  "addressLocality": "Jaipur",
                  "addressRegion": "Rajasthan",
                  "postalCode": "302003",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "26.9239",
                  "longitude": "75.8267"
                },
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday"
                    ],
                    "opens": "11:00",
                    "closes": "20:00"
                  }
                ],
                "areaServed": {
                  "@type": "Place",
                  "name": "Worldwide"
                },
                "sameAs": [
                  "https://www.instagram.com/khushigemsjaipur?igsh=a2UwcGttdzF5aHQ1&utm_source=qr",
                  "https://www.instagram.com/khushijewelssilver?igsh=MXFobWhkaTQ4Y3oweA%3D%3D&utm_source=qr"
                ],
                // INTERNATIONAL SHIPPING SCHEMA
                "potentialAction": {
                  "@type": "BuyAction",
                  "target": "https://www.khushigemsjaipur.com"
                },
                "shippingDetails": {
                  "@type": "OfferShippingDetails",
                  "shippingDestination": [
                    { "@type": "DefinedRegion", "addressCountry": "IN" },
                    { "@type": "DefinedRegion", "addressCountry": "US" },
                    { "@type": "DefinedRegion", "addressCountry": "GB" },
                    { "@type": "DefinedRegion", "addressCountry": "AE" },
                    { "@type": "DefinedRegion", "addressCountry": "CA" },
                    { "@type": "DefinedRegion", "addressCountry": "AU" }
                  ],
                  "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                      "@type": "QuantitativeValue",
                      "minValue": 1,
                      "maxValue": 3,
                      "unitCode": "d"
                    },
                    "transitTime": {
                      "@type": "QuantitativeValue",
                      "minValue": 5,
                      "maxValue": 12,
                      "unitCode": "d"
                    }
                  }
                }
              },
              // SCHEMA B: The Website (For Sitelinks Search Box)
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://www.khushigemsjaipur.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.khushigemsjaipur.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ])
          }}
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-S7H9V04LJS"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S7H9V04LJS');
          `}
        </Script>
        <Script 
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js" 
          strategy="beforeInteractive" 
        />

        <FirebaseClientProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <div className="bg-secondary text-secondary-foreground text-center py-2 text-sm">
                    Free shipping throughout India • Worldwide Shipping Available
                  </div>
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
                <WhatsAppButton />
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}