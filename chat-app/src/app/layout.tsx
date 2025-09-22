import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ChatBot - AI Assistant",
  description: "A modern chatbot application powered by AI",
  keywords: ["chatbot", "AI", "assistant", "conversation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-white dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
