import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ModeToggle } from "@/components/custom/mode-switcher";
import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import { description, keywords, title } from "@/lib/Meta";
import ServiceWorker from "@/components/ServiceWorker";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: title,
  description: description,
  keywords: keywords,
  openGraph: {
    title: "Tasker Company - Comprehensive Services for Your Needs",
    description:
      "Tasker Company offers a wide range of services, including hiring skilled technicians, expert electricians, and professionals in any field of your life. Discover seamless solutions tailored to your needs",
    url: "https://taskercompany.com", // Replace with the actual URL
    siteName: "Tasker Company",
    images: [
      {
        url: "https://taskercompany.com/assets/images/og-image.webp", // Replace with the actual OG image URL
        width: 1200,
        height: 630,
        alt: "Tasker Company - Comprehensive Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@taskercompany", // Replace with your Twitter handle
    title: "Tasker Company - Comprehensive Services for Your Needs",
    description:
      "Tasker Company offers a wide range of services, including hiring skilled technicians, expert electricians, and professionals in any field of your life. Discover seamless solutions tailored to your needs",
    images: ["https://taskercompany.com/assets/images/og-image.webp"], // Replace with the actual Twitter image URL
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  minimumScale: 1,
  initialScale: 1,
  userScalable: false,
  viewportFit: "cover",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system">
            <div vaul-drawer-wrapper="" className="bg-background">
              <NextTopLoader
                showSpinner={false}
                height={4}
                color="hsl(var(--primary))"
              />
              {children}
              <ServiceWorker />
            </div>
            <div className="fixed bottom-4 right-4">
              <ModeToggle />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
