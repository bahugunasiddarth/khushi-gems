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
  // 1. Static pages - THESE ARE YOUR SITELINK CANDIDATES
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
    // ACTION: Increased priority to 0.9 for main pages (except home which is 1)
    // This tells Google: "These are the most important sections of my site."
    priority: route === '' ? 1 : 0.9, 
  }));

  // 2. Category pages - ALSO SITELINK CANDIDATES
  const categoryRoutes = silverCategories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    // Keep high priority for categories
    priority: 0.8,
  }));

  // 3. Product pages
  const products = await getAllProductsForSEO();
  
  const addedUrls = new Set<string>();
  const productRoutes: MetadataRoute.Sitemap = [];

  products.forEach((product) => {
    const finalSlug = product.slug || slugify(product.name) || product.id;
    const url = `${baseUrl}/products/${finalSlug}`;

    if (!addedUrls.has(url)) {
      addedUrls.add(url);
      productRoutes.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        // ACTION: Lowered priority to 0.6
        // This prevents products from "drowning out" your main pages.
        priority: 0.6, 
      });
    }
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}