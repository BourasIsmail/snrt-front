"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Truck, Plus, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import Link from "next/link"
import { Footer } from "@/components/footer"
import type { Unite } from "@/app/types/Unite"
import { useToast } from "@/hooks/use-toast"
import { AddUniteForm } from "@/components/add-unite-form"
import { getUnites, deleteUnite } from "@/app/api/unite"
import type {User} from "@/app/types/User";
import {getCurrentUsers} from "@/app/api";

export default function Home() {
    const [unites, setUnites] = useState<Unite[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAddUniteOpen, setIsAddUniteOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [uniteToDelete, setUniteToDelete] = useState<Unite | null>(null)
    const { toast } = useToast()

    const fetchUnites = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getUnites()
            setUnites(data)
        } catch (error) {
            console.error("Failed to fetch unites:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch unites",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchUnites()
    }, [fetchUnites])

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const userData = await getCurrentUsers()
            setUser(userData)
        } catch (error) {
            console.error("Failed to fetch user profile:", error)
            toast({
                title: "Error",
                description: "Failed to fetch user profile",
                variant: "destructive",
            })
        }
    }

    const handleDeleteUnite = async () => {
        if (!uniteToDelete) return

        try {
            await deleteUnite(uniteToDelete.id!)
            toast({
                title: "Success",
                description: "Unite deleted successfully",
            })
            fetchUnites()
        } catch (error) {
            console.error("Failed to delete unite:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete unite",
                variant: "destructive",
            })
        } finally {
            setIsDeleteConfirmOpen(false)
            setUniteToDelete(null)
        }
    }
    const is_Super_Admin = user?.roles?.map((role) => role.role).includes("SUPER_ADMIN_ROLES")
    const isUser = user?.roles?.map((role) => role.role).includes("USER_ROLES")
    const isObservateur = user?.roles?.map((role) => role.role).includes("OBSERVATEUR_ROLES")

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-poppins">
            <div className="flex justify-end m-4">
                <Button disabled={!is_Super_Admin} onClick={() => setIsAddUniteOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Unite
                </Button>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                    <div className="text-center max-w-7xl mx-auto">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : unites.length > 0 ?  (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto mt-12 mb-8">
                                {unites.map((unite, index) => (
                                    (isObservateur ||is_Super_Admin || (isUser && unite.id === user?.unite?.id)) && (
                                        <motion.div
                                            key={unite.id}
                                            initial={{opacity: 0, y: 20}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{delay: index * 0.1, duration: 0.5}}
                                            className="h-full"
                                        >
                                            <Card
                                                className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 dark:hover:bg-gradient-to-br dark:hover:from-gray-800 dark:hover:to-gray-700 h-full flex flex-col">
                                                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                                                    <Link href={`/unite/${unite.id}`} passHref className="flex-grow">
                                                        <div className="flex flex-col items-center text-center space-y-4">
                                                            <Truck
                                                                className="w-12 h-12 transition-colors duration-300 group-hover:text-blue-500"/>
                                                            <h3 className="text-xl font-semibold">{unite.nom}</h3>
                                                            <p className="text-muted-foreground">{unite.description}</p>
                                                        </div>
                                                    </Link>
                                                    <div className="mt-4 flex justify-end">
                                                        <Button
                                                            disabled={!is_Super_Admin}
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setUniteToDelete(unite)
                                                                setIsDeleteConfirmOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <div>No unites found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty space before footer */}
            <div className="h-24"></div>

            <Footer />

            {/* Background gradient effect */}
            <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background -z-10" />
            <div className="fixed inset-0 bg-grid-foreground/[0.02] -z-10" />

            <Dialog open={isAddUniteOpen} onOpenChange={setIsAddUniteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Unite</DialogTitle>
                    </DialogHeader>
                    <AddUniteForm
                        onClose={() => setIsAddUniteOpen(false)}
                        onUniteAdded={() => {
                            setIsAddUniteOpen(false)
                            fetchUnites()
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to delete the unite: {uniteToDelete?.nom}?</DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUnite}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

