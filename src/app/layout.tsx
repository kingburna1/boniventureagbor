import type { Metadata } from 'next';
import './globals.css';
import { PERSONAL_DATA } from '@/data/personalData';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://boniventure.dev'),
  title: {
    default: `${PERSONAL_DATA.name} | ${PERSONAL_DATA.title}`,
    template: `%s | ${PERSONAL_DATA.name}`,
  },
  description: PERSONAL_DATA.bio,
  keywords: [
    'Boniventure Agbor',
    'Full Stack Engineer',
    'Product Designer',
    'Senior Frontend Engineer',
    'Next.js 14',
    'React 18',
    'TypeScript',
    'Tailwind CSS',
    'Design Systems',
    'UX Architecture',
    'PostgreSQL',
    'Prisma ORM',
    'WebSockets',
    'AI Systems',
  ],
  authors: [{ name: PERSONAL_DATA.name, url: PERSONAL_DATA.socials.github }],
  creator: PERSONAL_DATA.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://boniventure.dev',
    siteName: `${PERSONAL_DATA.name} Portfolio`,
    title: `${PERSONAL_DATA.name} — ${PERSONAL_DATA.title}`,
    description: PERSONAL_DATA.bio,
    images: [
      {
        url: PERSONAL_DATA.avatarUrl,
        width: 1200,
        height: 630,
        alt: `${PERSONAL_DATA.name} - ${PERSONAL_DATA.title}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PERSONAL_DATA.name} — ${PERSONAL_DATA.title}`,
    description: PERSONAL_DATA.bio,
    images: [PERSONAL_DATA.avatarUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="bg-background text-foreground antialiased selection:bg-accent/30 selection:text-accent">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
