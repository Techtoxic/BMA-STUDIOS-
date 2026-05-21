import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700']
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: {
    default: 'BMA Photo Studio | Photography in Nyeri, Kenya',
    template: '%s | BMA Photo Studio Nyeri',
  },
  description: 'BMA Photo Studio — professional photography studio in Nyeri, Kenya. Wedding photography, studio portraits, passport photos, graphic design, camera accessories & editing training.',
  keywords: [
    'BMA photo studio',
    'BMA studios Nyeri',
    'BMA photography',
    'photography studio Nyeri',
    'wedding photography Nyeri',
    'studio portraits Nyeri Kenya',
    'passport photos Nyeri',
    'graphic design Nyeri',
    'photo editing Nyeri',
    'camera accessories Nyeri',
    'photographer Nyeri Kenya',
    'professional photography Kenya',
  ],
  authors: [{ name: 'BMA Photo Studio', url: 'https://bmastudio.maxxciey.me' }],
  creator: 'BMA Photo Studio',
  publisher: 'BMA Photo Studio',
  metadataBase: new URL('https://bmastudio.maxxciey.me'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://bmastudio.maxxciey.me',
    siteName: 'BMA Photo Studio Nyeri',
    title: 'BMA Photo Studio | Photography in Nyeri, Kenya',
    description: 'Professional photography studio in Nyeri, Kenya. Weddings, portraits, passport photos, graphic design & camera accessories.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BMA Photo Studio Nyeri Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMA Photo Studio | Nyeri, Kenya',
    description: 'Professional photography studio in Nyeri, Kenya.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
  },
  verification: {
    // Add your Google Search Console verification code here once you set it up
    // google: 'your-verification-code',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://bmastudio.maxxciey.me',
  name: 'BMA Photo Studio',
  alternateName: ['BMA Photography', 'BMA Studios Nyeri', 'BMA Photo Studio Nyeri'],
  description: 'Professional photography studio in Nyeri, Kenya offering wedding photography, studio portraits, passport photos, graphic design, camera accessories and photo editing training.',
  url: 'https://bmastudio.maxxciey.me',
  telephone: '+254725297393',
  image: 'https://bmastudio.maxxciey.me/og-image.jpg',
  priceRange: 'KSH',
  currenciesAccepted: 'KES',
  paymentAccepted: 'Cash, M-Pesa',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nyeri',
    addressRegion: 'Nyeri County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -0.4167,
    longitude: 36.9500,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  sameAs: [],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Photography' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Studio Portraits' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Passport Photos' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic Design' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Photo Editing Training' } },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${oswald.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
