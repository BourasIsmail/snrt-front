import "./globals.css"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import ReactQueryProvider from "@/components/ReactQueryProvider";
import {Toaster} from "@/components/ui/toaster";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "SNRT - Gestion de matériel",
  description: "Système de gestion de matériel pour SNRT",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/snrt.png", type: "image/png" },
    ],
    apple: { url: "/snrt.png", type: "image/png" },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ReactQueryProvider>
        <html lang="fr" suppressHydrationWarning>
          <body className={`${poppins.variable} font-sans`} suppressHydrationWarning>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </ReactQueryProvider>
  )
}

