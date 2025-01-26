// app/layout.tsx
import { ReactNode } from "react";
import { Header } from "./components/Header";
import { Metadata } from "next";
import RainbowKit from "./components/RainbowKit";
import "./globals.css";
interface LayoutProps {
  children: ReactNode;
}

// You can also define metadata like title, description here
export const metadata: Metadata = {
  title: "CrowdHive",
  description: "A platform to fund your next big project using Web3.",
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground bg-gradient-to-r from-gray-900 via-indigo-900 to-black">
        <main>
          <RainbowKit>
            <Header />
            {children}
          </RainbowKit>
        </main>
      </body>
    </html>
  );
}
