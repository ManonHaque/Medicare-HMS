import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "MediCare HMS - Healthcare Management System",
  description:
    "Hospital management prototype with admin, doctor, nurse, and patient portals",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} bg-slate-50`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased text-slate-900">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
