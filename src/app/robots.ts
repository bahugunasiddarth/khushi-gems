import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/checkout/',
          '/admin/',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://www.khushigemsjaipur.com/sitemap.xml',
    host: 'https://www.khushigemsjaipur.com',
  };
}
