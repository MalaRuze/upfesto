import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Upfesto | Simplify your event planning",
  description:
    "Upfesto simplifies event planning, so you can focus on creating an unforgettable experience for your attendees. Create your event page, send invites, track RSVPs, and more.",
  icons: {
    shortcut: ["/apple-touch-icon.png"],
    apple: ["/apple-touch-icon.png"],
  },
  manifest: "/site.webmanifest",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#FFCE00",
          colorTextOnPrimaryBackground: "#000000",
          borderRadius: "0.8rem",
        },
        elements: {
          card: "shadow-none rounded-xl w-full max-w-screen-xl mx-auto",
          rootBox: "w-full",
          navbar: "hidden sm:block",
          navbarMobileMenuRow: "hidden",
          headerTitle: "text-2xl font-semibold",
        },
        signIn: {
          elements: {
            rootBox: "relative h-[80vh] max-w-[500px] mx-auto",
            card: "w-full sm:absolute sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-y-1/2 sm:-translate-x-1/2",
          },
        },
        signUp: {
          elements: {
            rootBox: "relative h-[80vh] max-w-[500px] mx-auto",
            card: "w-full sm:absolute sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-y-1/2 sm:-translate-x-1/2",
          },
        },
      }}
    >
      <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
          <NavBar />
          {children}
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
