import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/navbar";
import styles from "./layout.module.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shuffle",
  description: "Shuffle: Mundane Social Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={styles.html}>
      <body className={inter.className}>
      <Navbar />
        {children}
        </body>
    </html>
  );
}
