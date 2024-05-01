import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { Inter } from "next/font/google";
import { TopNav } from "~/components/TopNav";
import { Toaster } from "~/components/ui/sonner";
import { CSPostHogProvider } from "./_analytics/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "ReStacked",
  description: "The stack sharing platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <CSPostHogProvider>
        <html lang="en">
          <body
            className={`font-sans ${inter.variable} dark h-screen w-screen max-w-[100vh] flex-col bg-background text-white`}
          >
            <TopNav />
            {children}
            <Toaster richColors />
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
