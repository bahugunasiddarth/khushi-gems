import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getSimilarProducts } from '@/lib/seo-data';
import ProductClientView from './client-view';

interface Props {
  params: Promise<{ slug: string }> // params is now a Promise
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // Must await params
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images?.[0]?.url || '/placeholder-image.jpg' }],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  // 1. Await params to get the slug
  const { slug } = await params; // Must await params

  // 2. Fetch Main Product
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // 3. Fetch Similar Products
  const similarProducts = await getSimilarProducts(product.category, product.material, product.id);

  // 4. SEO JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map(img => img.url),
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Khushi Gems and Jewellery' },
    offers: {
      '@type': 'Offer',
      url: `https://www.khushigemsjaipur.com/products/${slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.availability === 'READY TO SHIP' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClientView product={product} similarProducts={similarProducts} />
    </>
  );
}