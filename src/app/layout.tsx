"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import ModalProvider from "@/providers/modal-provider";
import { I18nextProvider } from 'react-i18next';
import i18n from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import Sidebar and ThemeProvider components
const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: true });
const ThemeProvider = dynamic(() => import("@/providers/theme-provider").then(mod => mod.ThemeProvider), { ssr: true });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <html lang="en" className={inter.className}>
      <head></head>
      <body>
        {isClient && (
          <I18nextProvider i18n={i18n}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                <div
                  className={`flex flex-col w-full h-full transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"
                    } p-4`}
                >
                  <ModalProvider>
                    {children}
                  </ModalProvider>
                  {/* {children} */}
                </div>
                <Toaster />
              </div>
            </ThemeProvider>
          </I18nextProvider>
        )}
      </body>
    </html>
  );
}
