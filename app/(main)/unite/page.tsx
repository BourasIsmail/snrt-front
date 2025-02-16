"use client"

import { motion } from "framer-motion"
import {Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {Footer} from "@/components/footer";

const technologies = [
    {
        icon: Truck,
        title: "Safe AI",
        description: "Developing secure and reliable artificial intelligence solutions",
        color: "group-hover:text-blue-500",
        delay: 0,
        link: "/safe-ai",
    },
    {
        icon: Truck,
        title: "Safety-Critical Systems",
        description: "Engineering systems where reliability is paramount",
        color: "group-hover:text-red-500",
        delay: 0.1,
        link: "/safety-critical-systems",
    },
    {
        icon: Truck,
        title: "Robotics",
        description: "Advanced robotics solutions for complex challenges",
        color: "group-hover:text-purple-500",
        delay: 0.2,
        link: "/robotics",
    },
]

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-poppins">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                    <div className="text-center max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto mt-12 mb-8">
                            {technologies.map((tech) => (
                                <motion.div
                                    key={tech.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: tech.delay, duration: 0.5 }}
                                    className="h-full"
                                >
                                    <Link href={tech.link} passHref>
                                        <Card className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 dark:hover:bg-gradient-to-br dark:hover:from-gray-800 dark:hover:to-gray-700 h-full flex flex-col cursor-pointer">
                                            <CardContent className="p-6 flex-grow flex flex-col justify-between">
                                                <div className="flex flex-col items-center text-center space-y-4">
                                                    <tech.icon className={`w-12 h-12 transition-colors duration-300 ${tech.color}`} />
                                                    <h3 className="text-xl font-semibold">{tech.title}</h3>
                                                    <p className="text-muted-foreground">{tech.description}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty space before footer */}
            <div className="h-24"></div>

            <Footer />

            {/* Background gradient effect */}
            <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background -z-10" />
            <div className="fixed inset-0 bg-grid-foreground/[0.02] -z-10" />
        </div>
    )
}

