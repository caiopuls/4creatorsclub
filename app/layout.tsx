import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: "4Creators Club — Lista de Espera",
  description:
    "Entre na lista de espera gratuita do 4Creators Club (4C Club). Conteúdos secretos para viralizar, criar autoridade e vender no digital. Conecte-se com creators, editores, designers e empresários.",
  keywords: "creators, marketing digital, autoridade, viralização, infoprodutos",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}