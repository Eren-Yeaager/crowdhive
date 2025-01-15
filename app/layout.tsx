// app/layout.tsx
import { ReactNode } from "react";
import { Header } from "./components/layout/Header";
import { Metadata } from "next";
import "./globals.css";
interface LayoutProps {
  children: ReactNode;
}

// You can also define metadata like title, description here
export const metadata: Metadata = {
  title: "Web3 Crowdfunding",
  description:
    "A platform to fund your next big project using blockchain technology.",
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main>{children}</main>
      </body>
    </html>
  );
}
