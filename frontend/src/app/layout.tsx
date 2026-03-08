import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DevFolio Pro | BTech CSE Student Portfolio',
  description: 'Next-gen 3D animated developer portfolio featuring React Three Fiber, Next.js, and GSAP.',
  openGraph: {
    title: 'DevFolio Pro | BTech CSE Student Portfolio',
    description: 'Next-gen 3D animated developer portfolio.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme cookie server-side — eliminates Flash of Wrong Theme (FWOT)
  // Cookie is set by themeStore.ts on the client and read here before first paint
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme');
  const theme = themeCookie?.value === 'light' ? 'light' : 'dark';

  return (
    <html lang="en" data-theme={theme} className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-base-primary text-text-primary selection:bg-accent-blue selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
