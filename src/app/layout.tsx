import type { Metadata } from 'next';
import './globals.css';
import { PERSONAL_DATA } from '@/data/personalData';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: `${PERSONAL_DATA.name} | ${PERSONAL_DATA.title}`,
  description: PERSONAL_DATA.bio,
  keywords: [
    'Senior Developer',
    'Product Designer',
    'Full Stack Engineer',
    'Next.js Portfolio',
    'TypeScript',
    'Tailwind CSS',
    'UX Architecture',
  ],
  authors: [{ name: PERSONAL_DATA.name }],
  openGraph: {
    title: `${PERSONAL_DATA.name} — ${PERSONAL_DATA.title}`,
    description: PERSONAL_DATA.bio,
    type: 'website',
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
