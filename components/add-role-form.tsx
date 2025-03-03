"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/api"
import type { Roles } from "@/app/types/Roles"

interface AddRoleFormProps {
    onRoleAdded: () => void
}

export function AddRoleForm({ onRoleAdded }: AddRoleFormProps) {
    const [role, setRole] = useState<Roles>({
        role: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRole((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await api.post("/roles/add", role)
            toast({
                title: "Success",
                description: "Role added successfully",
            })
            onRoleAdded()
        } catch (error) {
            console.error("Failed to add role:", error)
            toast({
                title: "Error",
                description: "Failed to add role",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="role">Role Name</Label>
                <Input id="role" name="role" value={role.role} onChange={handleChange} required />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Role"}
            </Button>
        </form>
    )
}

