import { getCookie } from "cookies-next"
import type { Unite } from "@/app/types/Unite"
import {api} from "@/app/api/index";


export async function getUnites(): Promise<Unite[]> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        const { data } = await api.get("/unite/list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return data
    } catch (error) {
        throw new Error(String(error))
    }
}

export async function deleteUnite(id: number): Promise<void> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        await api.delete(`/unite/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        throw new Error(String(error))
    }
}

export async function getUnite(id: number): Promise<Unite> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        const { data } = await api.get(`/unite/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return data
    } catch (error) {
        throw new Error(String(error))
    }
}
