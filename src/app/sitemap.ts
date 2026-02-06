import { MetadataRoute } from 'next';
import { getAllProductsForSEO } from '@/lib/seo-data';
import { silverCategories } from '@/lib/data';

const baseUrl = 'https://www.khushigemsjaipur.com';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1️⃣ Static pages (ONLY real pages)
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/collections',
    '/blog',
    '/location',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.7,
  }));

  // 2️⃣ Category pages
  const categoryRoutes = silverCategories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat.name)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 3️⃣ Product pages
  const products = await getAllProductsForSEO();

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug ?? slugify(product.name)}`,
    lastModified: new Date(), 
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
