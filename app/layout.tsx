import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";
import { PredictionFormModal } from "./components/prediction-form";
import { PredictionModalProvider } from "./components/prediction-modal-context";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Job Prediction",
  description:
    "Employability prediction from your academic profile, skills, and experience—grounded in historical outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <PredictionModalProvider>
          <Navbar />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <PredictionFormModal />
        </PredictionModalProvider>
        <Analytics />
      </body>
    </html>
  );
}
