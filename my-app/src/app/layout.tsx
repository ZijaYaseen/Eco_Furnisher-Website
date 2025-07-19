import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Eco-Furnisher Website",
  description: "created by Zija Yaseen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
 