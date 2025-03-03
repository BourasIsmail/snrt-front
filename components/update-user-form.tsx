"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/api"
import type { User } from "@/app/types/User"
import type { Roles } from "@/app/types/Roles"
import type { Unite } from "@/app/types/Unite"

interface UpdateUserFormProps {
    user: User
    roles: Roles[]
    unites: Unite[]
    onUserUpdated: () => void
}

export function UpdateUserForm({ user, roles, unites, onUserUpdated }: UpdateUserFormProps) {
    const [updatedUser, setUpdatedUser] = useState<User>({ ...user })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUpdatedUser((prev) => ({ ...prev, [name]: value }))
    }

    const handleRoleChange = (value: string) => {
        const roleId = Number.parseInt(value, 10)
        setUpdatedUser((prev) => ({ ...prev, roles: [{ id: roleId }] }))
    }

    const handleUniteChange = (value: string) => {
        const uniteId = Number.parseInt(value, 10)
        setUpdatedUser((prev) => ({ ...prev, unite: { id: uniteId } }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await api.put(`/user/${user.id}`, updatedUser)
            toast({
                title: "Success",
                description: "User updated successfully",
            })
            onUserUpdated()
        } catch (error) {
            console.error("Failed to update user:", error)
            toast({
                title: "Error",
                description: "Failed to update user",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={updatedUser.name} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={updatedUser.email} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={updatedUser.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                />
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={handleRoleChange} defaultValue={updatedUser.roles?.[0]?.id?.toString()}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id?.toString() || ""}>
                                {role.role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="unite">Unite</Label>
                <Select onValueChange={handleUniteChange} defaultValue={updatedUser.unite?.id?.toString()}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a unite" />
                    </SelectTrigger>
                    <SelectContent>
                        {unites.map((unite) => (
                            <SelectItem key={unite.id} value={unite.id?.toString() || ""}>
                                {unite.nom}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update User"}
            </Button>
        </form>
    )
}

