"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/app/types/User"
import type { Roles } from "@/app/types/Roles"
import type { Unite } from "@/app/types/Unite"
import {getCurrentUsers, getUsers} from "@/app/api"
import { api } from "@/app/api"
import { AddUserForm } from "@/components/add-user-form"
import { AddRoleForm } from "@/components/add-role-form"
import { UpdateUserForm } from "@/components/update-user-form"
import { Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [nameFilter, setNameFilter] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const [userToUpdate, setUserToUpdate] = useState<User | null>(null)
    const [roles, setRoles] = useState<Roles[]>([])
    const [unites, setUnites] = useState<Unite[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchUsers()
        fetchRoles()
        fetchUnites()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [nameFilter, roleFilter, users])

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

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const fetchedUsers = await getUsers()()
            setUsers(fetchedUsers)
        } catch (error: unknown) {
            setError((error as Error).message)
            console.error("Failed to fetch users:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await api.get("/roles/list")
            setRoles(response.data)
        } catch (error: unknown) {
            console.error("Failed to fetch roles:", error)
        }
    }

    const fetchUnites = async () => {
        try {
            const response = await api.get("/unite/list")
            setUnites(response.data)
        } catch (error: unknown) {
            console.error("Failed to fetch unites:", error)
        }
    }

    const filterUsers = () => {
        let filtered = users
        if (nameFilter) {
            filtered = filtered.filter((user) => user.name?.toLowerCase().includes(nameFilter.toLowerCase()))
        }
        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user.roles?.some((role) => role.id?.toString() === roleFilter))
        }
        setFilteredUsers(filtered)
    }

    const handleAddUser = () => {
        setIsAddUserOpen(false)
        fetchUsers()
    }

    const handleAddRole = () => {
        setIsAddRoleOpen(false)
        fetchRoles()
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        try {
            await api.delete(`/user/${userToDelete.id}`)
            toast({
                title: "Success",
                description: "User deleted successfully",
            })
            fetchUsers()
        } catch (error: unknown) {
            console.error("Failed to delete user:", error)
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            })
        } finally {
            setIsDeleteConfirmOpen(false)
            setUserToDelete(null)
        }
    }

    const handleUpdateUser = () => {
        setIsUpdateUserOpen(false)
        fetchUsers()
    }

    const is_Super_Admin = user?.roles?.map((role) => role.role).includes("SUPER_ADMIN_ROLES")


    return (
        <>
            {is_Super_Admin && (
        <div className="container mx-auto py-10">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Users</h1>

                <div className="space-x-2">
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!is_Super_Admin}>Add User</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                            </DialogHeader>
                            <AddUserForm onUserAdded={handleAddUser} roles={roles} unites={unites} />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!is_Super_Admin} variant="outline">Add Role</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Role</DialogTitle>
                            </DialogHeader>
                            <AddRoleForm onRoleAdded={handleAddRole} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="flex gap-4 mb-6">
                <Input
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Select onValueChange={setRoleFilter} value={roleFilter}>
                    <SelectTrigger className="max-w-sm">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id?.toString() || ""}>
                                {role.role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Unite</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.roles?.map((role) => role.role).join(", ")}</TableCell>
                            <TableCell>{user.unite?.nom}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setUserToUpdate(user)
                                            setIsUpdateUserOpen(true)
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setUserToDelete(user)
                                            setIsDeleteConfirmOpen(true)
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to delete the user: {userToDelete?.name}?</DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isUpdateUserOpen} onOpenChange={setIsUpdateUserOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                    </DialogHeader>
                    {userToUpdate && (
                        <UpdateUserForm user={userToUpdate} roles={roles} unites={unites} onUserUpdated={handleUpdateUser} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
        )}
        </>
    )
}