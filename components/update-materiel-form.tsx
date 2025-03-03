"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/api"
import { updateMateriel } from "@/app/api/materiel"
import type { Materiel } from "@/app/types/Materiel"
import type { Type } from "@/app/types/Type"
import { Minus, List } from "lucide-react"

interface UpdateMaterielFormProps {
    materiel: Materiel
    onMaterielUpdated: () => void
}

export function UpdateMaterielForm({ materiel, onMaterielUpdated }: UpdateMaterielFormProps) {
    const [updatedMateriel, setUpdatedMateriel] = useState<Materiel>(materiel)
    const [types, setTypes] = useState<Type[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [isTypeListOpen, setIsTypeListOpen] = useState(false)
    const [typeToDelete, setTypeToDelete] = useState<Type | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchTypes()
    }, [])

    const fetchTypes = async () => {
        try {
            const response = await api.get("/type/list")
            setTypes(response.data)
        } catch (error) {
            console.error("Failed to fetch types:", error)
            toast({
                title: "Error",
                description: "Failed to fetch types",
                variant: "destructive",
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUpdatedMateriel((prev) => ({ ...prev, [name]: value }))
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value, 10)
        setUpdatedMateriel((prev) => ({ ...prev, quantity: isNaN(value) ? 0 : value }))
    }

    const handleTypeChange = (value: string) => {
        const typeId = Number.parseInt(value, 10)
        setUpdatedMateriel((prev) => ({ ...prev, type: { id: typeId } }))
    }

    const handleSelectedChange = (checked: boolean) => {
        setUpdatedMateriel((prev) => ({ ...prev, selected: checked }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await updateMateriel(updatedMateriel)
            toast({
                title: "Success",
                description: "Materiel updated successfully",
            })
            onMaterielUpdated()
        } catch (error) {
            console.error("Failed to update materiel:", error)
            toast({
                title: "Error",
                description: "Failed to update materiel",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteType = async () => {
        if (!typeToDelete) return

        try {
            await api.delete(`/type/delete/${typeToDelete.id}`)
            toast({
                title: "Success",
                description: "Type deleted successfully",
            })
            fetchTypes()
        } catch (error) {
            console.error("Failed to delete type:", error)
            toast({
                title: "Error",
                description: "Failed to delete type",
                variant: "destructive",
            })
        } finally {
            setIsDeleteConfirmOpen(false)
            setTypeToDelete(null)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                        id="designation"
                        name="designation"
                        value={updatedMateriel.designation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="marque">Marque</Label>
                    <Input id="marque" name="marque" value={updatedMateriel.marque} onChange={handleChange} required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" name="model" value={updatedMateriel.model} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                        id="serialNumber"
                        name="serialNumber"
                        value={updatedMateriel.serialNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={updatedMateriel.quantity}
                        onChange={handleQuantityChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="etat">Etat</Label>
                    <Select
                        onValueChange={(value) => setUpdatedMateriel((prev) => ({ ...prev, etat: value }))}
                        value={updatedMateriel.etat}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an etat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Opérationnel">Opérationnel</SelectItem>
                            <SelectItem value="En Panne">En Panne</SelectItem>
                            <SelectItem value="En Maintenance">En Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="numMarche">Numero du marche</Label>
                    <Input
                        id="numMarche"
                        name="numMarche"
                        type="text"
                        value={updatedMateriel.numMarche}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="type">Type</Label>
                    <div className="flex space-x-2">
                        <Select onValueChange={handleTypeChange} defaultValue={updatedMateriel.type?.id?.toString()}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type.id} value={type.id?.toString() || ""}>
                                        {type.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsTypeListOpen(true)}>
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="selected" checked={updatedMateriel.selected} onCheckedChange={handleSelectedChange} />
                <Label htmlFor="selected">Selected</Label>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Updating..." : "Update Materiel"}
            </Button>

            <Dialog open={isTypeListOpen} onOpenChange={setIsTypeListOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Types List</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {types.map((type) => (
                            <div key={type.id} className="flex items-center justify-between py-2">
                                <span>{type.nom}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                        setTypeToDelete(type)
                                        setIsDeleteConfirmOpen(true)
                                    }}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to delete the type: {typeToDelete?.nom}?</DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteType}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    )
}

