"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <nav
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="relative w-20 h-8">
              <Image src="/snrt.png" alt="SNRT Logo" width={100} height={40} priority />
            </div>
            <Link href="/" className="text-foreground font-poppins text-xl">
              <span className="font-bold">SNRT</span>
            </Link>
          </div>
          <div className="text-lg font-medium">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#FF0000]">
              Gestion de matériel
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

