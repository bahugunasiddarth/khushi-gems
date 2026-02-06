import { Metadata } from 'next';
import CategoryClientView from './client-view';

type Props = {
  params: { categoryName: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.categoryName);
  
  return {
    title: `${categoryName} Jewellery | Khushi Gems Jaipur`,
    description: `Shop the finest collection of ${categoryName} at Khushi Gems and Jewellery. Handcrafted Silver & Gold designs, made in Jaipur, available for worldwide shipping.`,
    alternates: {
      canonical: `https://www.khushigemsjaipur.com/category/${params.categoryName}`,
    },
    openGraph: {
      title: `Buy ${categoryName} - Authentic Jaipur Jewellery`,
      description: `Explore our exclusive ${categoryName} collection. Authentic Jaipur craftsmanship.`,
      url: `https://www.khushigemsjaipur.com/category/${params.categoryName}`,
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

export default function CategoryPage({ params }: Props) {
  const categoryName = decodeURIComponent(params.categoryName);
  
  // JSON-LD for Breadcrumbs (Google loves this)
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
      "item": `https://www.khushigemsjaipur.com/category/${params.categoryName}`
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