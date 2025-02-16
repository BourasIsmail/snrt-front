import type React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {LayoutWithSidebar} from "@/components/layout-with-sidebar";
import {Poppins} from "next/font/google";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
})

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (

            <LayoutWithSidebar>{children}</LayoutWithSidebar>
    )
}
