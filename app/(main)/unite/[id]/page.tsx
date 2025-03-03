"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { getMaterielByUnite, deleteMateriel, updateMateriel } from "@/app/api/materiel"
import type { Materiel } from "@/app/types/Materiel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, Upload, Download, FileDown } from "lucide-react"
import { AddMaterielForm } from "@/components/add-materiel-form"
import { UpdateMaterielForm } from "@/components/update-materiel-form"
import { api, getCurrentUsers } from "@/app/api"
import * as XLSX from "xlsx"
import { getUnite } from "@/app/api/unite"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/app/types/User"

interface ExcelRow {
    Designation: string
    Marque: string
    Model: string
    "Serial Number": string
    Quantity: number
    NumMarche: string
    Etat: string
    Selected: string
    Type: string
}

export default function MaterielPage() {
    const [materiels, setMateriels] = useState<Materiel[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [filteredMateriels, setFilteredMateriels] = useState<Materiel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [isAddMaterielOpen, setIsAddMaterielOpen] = useState(false)
    const [isUpdateMaterielOpen, setIsUpdateMaterielOpen] = useState(false)
    const [materielToDelete, setMaterielToDelete] = useState<Materiel | null>(null)
    const [materielToUpdate, setMaterielToUpdate] = useState<Materiel | null>(null)
    const [uniteName, setUniteName] = useState<string>("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [numMarcheFilter, setNumMarcheFilter] = useState("")
    const [serialNumberFilter, setSerialNumberFilter] = useState("")
    const [types, setTypes] = useState<string[]>([])
    const { id } = useParams()
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [totalPages, setTotalPages] = useState(1)

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
    useEffect(() => {
        fetchMateriels()
        fetchUniteName()
    }, [])

    useEffect(() => {
        filterMateriels()
    }, [materiels, typeFilter, numMarcheFilter, serialNumberFilter])

    const fetchUniteName = async () => {
        try {
            const unite = await getUnite(Number(id))
            setUniteName(unite.nom || "")
        } catch (error) {
            console.error("Failed to fetch unite name:", error)
        }
    }

    const fetchMateriels = async () => {
        try {
            setIsLoading(true)
            const data = await getMaterielByUnite(Number(id))
            setMateriels(data)
            const uniqueTypes = Array.from(
                new Set(data.map((m) => m.type?.nom).filter((nom): nom is string => nom !== undefined)),
            )
            setTypes(uniqueTypes)
        } catch (error) {
            console.error("Failed to fetch materiels:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch materiels",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filterMateriels = () => {
        let filtered = materiels
        if (typeFilter !== "all") {
            filtered = filtered.filter((m) => m.type?.nom === typeFilter)
        }
        if (numMarcheFilter) {
            filtered = filtered.filter((m) => m.numMarche?.toLowerCase().includes(numMarcheFilter.toLowerCase()))
        }
        if (serialNumberFilter) {
            filtered = filtered.filter((m) => m.serialNumber?.toLowerCase().includes(serialNumberFilter.toLowerCase()))
        }
        setFilteredMateriels(filtered)
    }

    const handleDeleteMateriel = async () => {
        if (!materielToDelete) return

        try {
            await deleteMateriel(materielToDelete.id!)
            toast({
                title: "Success",
                description: "Materiel deleted successfully",
            })
            fetchMateriels()
        } catch (error) {
            console.error("Failed to delete materiel:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete materiel",
                variant: "destructive",
            })
        } finally {
            setIsDeleteConfirmOpen(false)
            setMaterielToDelete(null)
        }
    }

    const handleAddMateriel = () => {
        setIsAddMaterielOpen(false)
        fetchMateriels()
    }

    const handleUpdateMateriel = () => {
        setIsUpdateMaterielOpen(false)
        fetchMateriels()
    }

    const handleSelectedChange = async (materiel: Materiel, checked: boolean) => {
        try {
            const updatedMateriel = { ...materiel, selected: checked }
            await updateMateriel(updatedMateriel)
            setMateriels(materiels.map((m) => (m.id === materiel.id ? updatedMateriel : m)))
            toast({
                title: "Success",
                description: "Materiel updated successfully",
            })
        } catch (error) {
            console.error("Failed to update materiel:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update materiel",
                variant: "destructive",
            })
        }
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: "array" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[]

            const materielsToAdd: Materiel[] = json.map((row) => ({
                designation: row.Designation,
                marque: row.Marque,
                model: row.Model,
                serialNumber: row["Serial Number"],
                quantity: row.Quantity,
                numMarche: row.NumMarche,
                etat: row.Etat,
                selected: row.Selected === "TRUE",
                type: { nom: row.Type },
                unite: { id: Number(id) },
            }))

            try {
                await api.post("/materiel/addMultiple", materielsToAdd)
                toast({
                    title: "Success",
                    description: "Materiels added successfully",
                })
                await fetchMateriels()
            } catch (error) {
                console.error("Failed to add materiels:", error)
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to add materiels",
                    variant: "destructive",
                })
            }
        }
        reader.readAsArrayBuffer(file)
    }

    const handleDownloadTemplate = () => {
        const link = document.createElement("a")
        link.href = "/Classeur1.xlsx"
        link.download = "Classeur1.xlsx"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleExportToExcel = () => {
        const selectedMateriels = materiels.filter((materiel) => materiel.selected)
        const data = selectedMateriels.map((materiel) => ({
            Unite: uniteName,
            Designation: materiel.designation,
            Marque: materiel.marque,
            Model: materiel.model,
            "Serial Number": materiel.serialNumber,
            Quantity: materiel.quantity,
            NumMarche: materiel.numMarche,
            Etat: materiel.etat,
            Type: materiel.type?.nom,
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Selected Materiels")
        XLSX.writeFile(wb, `Selected_Materiels_${uniteName}_Unite_${id}.xlsx`)
        toast({
            title: "Export Successful",
            description: `Exported ${selectedMateriels.length} selected materiel(s) to Excel.`,
        })
    }

    const is_Super_Admin = user?.roles?.map((role) => role.role).includes("SUPER_ADMIN_ROLES")
    const isUser = user?.roles?.map((role) => role.role).includes("USER_ROLES") && user?.unite?.id === Number(id)
    const is_Observateur = user?.roles?.map((role) => role.role).includes("OBSERVATEUR_ROLES")

    const updatePageFromUrl = useCallback(() => {
        const pageParam = searchParams.get("page")
        const newPage = pageParam ? Number.parseInt(pageParam, 10) : 1
        setCurrentPage(newPage)
    }, [searchParams])

    useEffect(() => {
        updatePageFromUrl()
    }, [updatePageFromUrl])

    useEffect(() => {
        const handleRouteChange = () => {
            updatePageFromUrl()
        }

        window.addEventListener("popstate", handleRouteChange)

        return () => {
            window.removeEventListener("popstate", handleRouteChange)
        }
    }, [updatePageFromUrl])

    useEffect(() => {
        setTotalPages(Math.ceil(filteredMateriels.length / itemsPerPage))
        if (currentPage > Math.ceil(filteredMateriels.length / itemsPerPage)) {
            setCurrentPage(1)
        }
    }, [filteredMateriels, itemsPerPage, currentPage])

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredMateriels.slice(startIndex, endIndex)
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Materiels for Unite {id}</h1>
                <div className="space-x-2">
                    <Button disabled={!isUser && !is_Super_Admin} onClick={() => setIsAddMaterielOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Materiel
                    </Button>
                    <Button disabled={!isUser && !is_Super_Admin} onClick={handleDownloadTemplate}>
                        <Download className="mr-2 h-4 w-4" /> Download Template
                    </Button>
                    <Button disabled={!isUser && !is_Super_Admin} onClick={handleImportClick}>
                        <Upload className="mr-2 h-4 w-4" /> Import from Excel
                    </Button>
                    <Button disabled={!isUser && !is_Super_Admin} onClick={handleExportToExcel}>
                        <FileDown className="mr-2 h-4 w-4" /> Export to Excel
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                    />
                </div>
            </div>
            <div className="mb-4 flex space-x-4">
                <Select onValueChange={setTypeFilter} defaultValue="all">
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Filter by Num Marché"
                    value={numMarcheFilter}
                    onChange={(e) => setNumMarcheFilter(e.target.value)}
                    className="w-[200px]"
                />
                <Input
                    placeholder="Filter by Serial Number"
                    value={serialNumberFilter}
                    onChange={(e) => setSerialNumberFilter(e.target.value)}
                    className="w-[200px]"
                />
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : filteredMateriels.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Selected</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Marque</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>Serial Number</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Num du marché</TableHead>
                            <TableHead>Etat</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {getPaginatedData().map(
                            (materiel) =>
                                (is_Observateur || is_Super_Admin || isUser) && (
                                    <TableRow key={materiel.id}>
                                        <TableCell>
                                            <Checkbox
                                                disabled={is_Observateur}
                                                checked={materiel.selected}
                                                onCheckedChange={(checked) => handleSelectedChange(materiel, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell>{materiel?.designation || ""}</TableCell>
                                        <TableCell>{materiel?.marque || ""}</TableCell>
                                        <TableCell>{materiel?.model || ""}</TableCell>
                                        <TableCell>{materiel?.serialNumber || ""}</TableCell>
                                        <TableCell>{materiel?.quantity || ""}</TableCell>
                                        <TableCell>{materiel?.numMarche || ""}</TableCell>
                                        <TableCell>{materiel?.etat || ""}</TableCell>
                                        <TableCell>{materiel?.type?.nom || ""}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    disabled={is_Observateur}
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setMaterielToUpdate(materiel)
                                                        setIsUpdateMaterielOpen(true)
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    disabled={is_Observateur}
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setMaterielToDelete(materiel)
                                                        setIsDeleteConfirmOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ),
                        )}
                    </TableBody>
                </Table>
            ) : (
                <div>No materiels found for this unite</div>
            )}

            {filteredMateriels.length > 0 && (
                <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    className="w-9 h-9"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to delete the materiel: {materielToDelete?.designation}?
                    </DialogDescription>
                    <DialogFooter>
                        <Button
                            disabled={!isUser && !is_Super_Admin}
                            variant="outline"
                            onClick={() => setIsDeleteConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button disabled={!isUser && !is_Super_Admin} variant="destructive" onClick={handleDeleteMateriel}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddMaterielOpen} onOpenChange={setIsAddMaterielOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Materiel</DialogTitle>
                    </DialogHeader>
                    <AddMaterielForm onMaterielAdded={handleAddMateriel} uniteId={Number(id)} />
                </DialogContent>
            </Dialog>

            <Dialog open={isUpdateMaterielOpen} onOpenChange={setIsUpdateMaterielOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Materiel</DialogTitle>
                    </DialogHeader>
                    {materielToUpdate && (
                        <UpdateMaterielForm materiel={materielToUpdate} onMaterielUpdated={handleUpdateMateriel} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

