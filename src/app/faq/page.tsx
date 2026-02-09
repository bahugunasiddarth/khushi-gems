import { Metadata } from "next";
import FaqClient from "./client-view";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Custom Jewellery & Shipping Policy",
  description: "Have questions about ordering custom gold and silver jewellery? Read about our shipping, customization, and return policies at Khushi Gems Jaipur.",
  keywords: ["Jewellery Customization", "Gold Jewellery Shipping", "Buy Silver Jaipur", "Jewellery Return Policy", "Jaipur Jewellery FAQ"]
};

export default function FaqPage() {
  return (
    <>
      {/* 1. GOOGLE FAQ SCHEMA - Helping you rank in "People Also Ask" */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Where is your jewellery made?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All our jewellery is handcrafted in our own workshop in Johari Bazar, Jaipur — a world-renowned hub for gold, silver, polki, kundan-meena, and jadau craftsmanship."
                }
              },
              {
                "@type": "Question",
                "name": "Can I customise orders?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We offer complete customisation—design, artwork, craftsmanship, and even alternative metals like copper. We are famous in Jaipur for bespoke bridal jewellery."
                }
              },
              {
                "@type": "Question",
                "name": "Do you ship internationally?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we ship our authentic Jaipur jewellery worldwide. Shipping timelines vary by location, typically taking 3-5 weeks for made-to-order pieces."
                }
              },
              {
                "@type": "Question",
                "name": "What materials do you use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We exclusively work with pure gold and 92.5 sterling silver, ensuring authenticity, quality, and lasting value in every piece."
                }
              }
            ]
          })
        }}
      />
      <FaqClient />
    </>
  );
}