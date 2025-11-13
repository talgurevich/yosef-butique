import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/cart',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://yossef-boutique.co.il/sitemap.xml',
  };
}
