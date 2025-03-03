"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/api"
import type { Unite } from "@/app/types/Unite"

interface AddUniteFormProps {
    onClose: () => void
    onUniteAdded: () => void
}

export function AddUniteForm({ onClose, onUniteAdded }: AddUniteFormProps) {
    const [unite, setUnite] = useState<Unite>({
        nom: "",
        description: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUnite((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            console.log("Submitting unite:", unite)
            const response = await api.post("/unite/add", unite)
            console.log("Response:", response.data)
            toast({
                title: "Success",
                description: "Unite added successfully",
            })
            onUniteAdded()
            onClose()
        } catch (error) {
            console.error("Failed to add unite:", error)
            toast({
                title: "Error",
                description: "Failed to add unite",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" value={unite.nom} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={unite.description} onChange={handleChange} required />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Unite"}
                </Button>
            </div>
        </form>
    )
}

