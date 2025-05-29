import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rental Tracker",
  description: "Track your house rental applications and viewings",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider>
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen">
              <AppSidebar />
              <div className="flex-1">
                {/* Mobile header with trigger */}
                <div className="flex h-14 items-center border-b px-4 md:hidden">
                  <SidebarTrigger />
                </div>
                <main className="flex-1">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
