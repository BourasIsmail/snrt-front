"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api, getCurrentUsers } from "@/app/api"
import type { User } from "@/app/types/User"

interface EditProfileFormProps {
    onClose: () => void
}

export function EditProfileForm({ onClose }: EditProfileFormProps) {
    const [user, setUser] = useState<User | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const { toast } = useToast()

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match")
            return
        }

        setIsLoading(true)
        try {
            const updatedUser = {
                ...user,
                password: newPassword || undefined, // Only include password if it's not empty
            }
            await api.put(`/user/${user.id}`, updatedUser)
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
            onClose()
        } catch (error) {
            console.error("Failed to update profile:", error)
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser((prev) => (prev ? { ...prev, [name]: value } : null))
    }

    if (!user) return <div>Loading...</div>

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" value={user.name} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Mise à jour..." : "Mettre à jour"}
                </Button>
            </div>
        </form>
    )
}

