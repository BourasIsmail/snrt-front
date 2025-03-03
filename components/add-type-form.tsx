"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/api"
import type { Type } from "@/app/types/Type"

interface AddTypeFormProps {
    onTypeAdded: () => void
}

export function AddTypeForm({ onTypeAdded }: AddTypeFormProps) {
    const [type, setType] = useState<Type>({ nom: "" })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setType((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await api.post("/type/add", type)
            toast({
                title: "Success",
                description: "Type added successfully",
            })
            onTypeAdded()
        } catch (error) {
            console.error("Failed to add type:", error)
            toast({
                title: "Error",
                description: "Failed to add type",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="nom">Type Name</Label>
                <Input id="nom" name="nom" value={type.nom} onChange={handleChange} required />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add Type"}
            </Button>
        </form>
    )
}

