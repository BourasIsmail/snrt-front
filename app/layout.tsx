import "../globals.css"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import type React from "react"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "SNRT - Gestion de matériel",
  description: "Système de gestion de matériel pour SNRT",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutWithSidebar>{children}</LayoutWithSidebar>
        </ThemeProvider>
      </body>
    </html>
  )
}

