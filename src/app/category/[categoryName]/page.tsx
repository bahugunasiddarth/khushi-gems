import { Metadata } from 'next';
import CategoryClientView from './client-view';

type Props = {
  params: Promise<{ categoryName: string }> // params is now a Promise
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // Must await params
  const categoryName = decodeURIComponent(resolvedParams.categoryName);
  
  return {
    title: `${categoryName} Jewellery | Khushi Gems Jaipur`,
    description: `Shop the finest collection of ${categoryName} at Khushi Gems and Jewellery. Handcrafted Silver & Gold designs, made in Jaipur, available for worldwide shipping.`,
    alternates: {
      canonical: `https://www.khushigemsjaipur.com/category/${resolvedParams.categoryName}`,
    },
    openGraph: {
      title: `Buy ${categoryName} - Authentic Jaipur Jewellery`,
      description: `Explore our exclusive ${categoryName} collection. Authentic Jaipur craftsmanship.`,
      url: `https://www.khushigemsjaipur.com/category/${resolvedParams.categoryName}`,
      images: [
        {
          url: '/khushigems.png', 
          width: 1200,
          height: 630,
          alt: `${categoryName} by Khushi Gems`,
        },
      ],
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params; // Must await params
  const categoryName = decodeURIComponent(resolvedParams.categoryName);
  
  // JSON-LD for Breadcrumbs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.khushigemsjaipur.com"
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": categoryName,
      "item": `https://www.khushigemsjaipur.com/category/${resolvedParams.categoryName}`
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryClientView categoryName={categoryName} />
    </>
  );
}