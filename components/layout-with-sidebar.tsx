"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import type React from "react" // Added import for React

export function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onToggle={setIsSidebarOpen} />
      <motion.div
        className="flex-1 flex flex-col overflow-hidden"
        animate={{ marginLeft: isSidebarOpen ? 250 : 60 }}
        transition={{ duration: 0.3 }}
      >
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">{children}</main>
      </motion.div>
    </div>
  )
}

