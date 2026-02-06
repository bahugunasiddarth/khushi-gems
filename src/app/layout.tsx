import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/components/cart-provider';
import { WishlistProvider } from '@/components/wishlist-provider';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ProductProvider } from '@/components/product-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.khushigemsjaipur.com'),
  title: {
    default: 'Khushi Gems and Jewellery | Best Jewellery Shop in Jaipur',
    template: '%s | Khushi Gems Jaipur'
  },
  description:
  'Khushi Gems and Jewellery is a trusted jewellery store in Johari Bazar, Jaipur. Discover authentic Gold, Silver, Kundan Meena, and traditional Rajasthani jewellery with worldwide shipping.',
  keywords: [
  'Jaipur Jewellery Market',
  'Johari Bazar Jewellery Shop',
  'Best Jewellery Shop in Jaipur',
  'Jaipur Gold Jewellery',
  'Kundan Meena Jewellery Jaipur',
  'Jaipur Silver Jewellery',
  'Traditional Rajasthani Jewellery',
  'Bridal Jewellery Jaipur',
  'Handcrafted Jewellery Jaipur',
  'Jewellery Shop Near Johari Bazar',
  'Jaipur Jewellery Online',
  'Indian Jewellery Worldwide Shipping'
],
openGraph: {
  type: 'website',
  locale: 'en_IN',
  url: 'https://www.khushigemsjaipur.com',
  siteName: 'Khushi Gems and Jewellery',
  title: 'Khushi Gems – Johari Bazar Jewellery Market, Jaipur',
  description:
    'Buy authentic Jaipur jewellery from Johari Bazar. Gold, Silver & Kundan Meena jewellery with worldwide delivery.',
  images: [
    {
      url: '/khushigems.png',
      width: 1200,
      height: 630,
      alt: 'Khushi Gems and Jewellery Johari Bazar Jaipur',
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
        
        {/* Local Business Schema (JSON-LD) */}
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      "name": "Khushi Gems and Jewellery",
      "image": "https://www.khushigemsjaipur.com/khushigems.png",
      "description":
        "Trusted jewellery store in Johari Bazar, Jaipur offering Gold, Silver, Kundan Meena and traditional Rajasthani jewellery.",
      "url": "https://www.khushigemsjaipur.com",
      "telephone": "+919928070606",

      "address": {
        "@type": "PostalAddress",
        "streetAddress": "172, Badi Chopar, Mehandi Ka Chowk, Johri Bazar",
        "addressLocality": "Jaipur",
        "addressRegion": "Rajasthan",
        "postalCode": "302003",
        "addressCountry": "IN",
        "priceRange": "₹500 - ₹25,00,000",
        "currenciesAccepted": "INR, USD, EUR",
        "paymentAccepted": "Credit Card, UPI, Bank Transfer",
        "hasMap": "https://maps.app.goo.gl/Z3n1Dwg4TjQJqx8BA",
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
        "name": "Jaipur Jewellery Market"
      },

      "sameAs": [
        "https://www.instagram.com/khushigemsjaipur?igsh=a2UwcGttdzF5aHQ1&utm_source=qr",
        "https://www.instagram.com/khushijewelssilver?igsh=MXFobWhkaTQ4Y3oweA%3D%3D&utm_source=qr"
      ]
    })
  }}
/>

      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <FirebaseClientProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <div className="bg-secondary text-secondary-foreground text-center py-2 text-sm">
                    Free shipping throughout india
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