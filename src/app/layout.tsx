import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PageTitleProvider } from "@/lib/context/PageTitleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campaign Manager",
  description: "Marketing Campaign Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <PageTitleProvider>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-14 w-[calc(100%-3.5rem)] h-full">
              <Header />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </PageTitleProvider>
      </body>
    </html>
  );
}
