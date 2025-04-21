import { UnifiedProvider } from "@/components/contexts/UnifiedContext";
import { NextAuthProvider } from "@/components/provider/NextAuthProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PENTAMA",
  description: "Penilaian Tugas Akhir Mahasiswa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scrollbar-hidden">
      <body className="font-poppins bg-black">
        <NextAuthProvider >
          <UnifiedProvider>
            {children}
          </UnifiedProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
