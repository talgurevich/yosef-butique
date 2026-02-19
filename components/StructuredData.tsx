export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'שטיחי בוטיק יוסף',
    alternateName: 'Boutique Joseph Carpets',
    description: 'שטיחים איכותיים לכל בית - מבחר רחב של שטיחים מודרניים, קלאסיים ומעוצבים',
    url: 'https://boutique-yossef.co.il',
    telephone: '+972-51-509-2208',
    email: 'info@boutique-yossef.co.il',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'השקד משק 47',
      addressLocality: 'מושב בית עזרא',
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.77',
      longitude: '34.82',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/share/1FGwU1cT56/?mibextid=wwXIfr',
      'https://www.instagram.com/yossef_carpets',
      'https://www.tiktok.com/@butiqyossef1',
    ],
    priceRange: '₪₪',
    image: 'https://boutique-yossef.co.il/og-image.jpg',
    '@id': 'https://boutique-yossef.co.il/#organization',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'שטיחי בוטיק יוסף',
    url: 'https://boutique-yossef.co.il',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://boutique-yossef.co.il/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
