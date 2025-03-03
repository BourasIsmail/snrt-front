import { getCookie } from "cookies-next"
import { api } from "@/app/api/index"

export interface DashboardData {
    materielsCount: number
    unitesCount: number
    usersCount: number
    rolesCount: number
    typesCount: number
}

export interface TypeCount {
    typeName: string
    count: number
}

export interface UniteCount {
    uniteName: string
    count: number
}

export interface UniteTypeCount {
    uniteName: string
    typeName: string
    count: number
}

export async function getDashboardData(): Promise<DashboardData> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        const { data } = await api.get("/dashboard/getDashboardData", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return data
    } catch (error) {
        throw new Error(String(error))
    }
}

export async function getDashboardByType(): Promise<TypeCount[]> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        const { data } = await api.get("/dashboard/getDashboardByType", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        // Transform the data to a more usable format
        // Backend returns [["Type1", 10], ["Type2", 5], ...]
        return data.map((item: [string, number]) => ({
            typeName: item[0],
            count: item[1],
        }))
    } catch (error) {
        throw new Error(String(error))
    }
}

export async function getDashboardByUnite(): Promise<UniteCount[]> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        const { data } = await api.get("/dashboard/getDashboardByUnite", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        // Transform the data to a more usable format
        return data.map((item: [string, number]) => ({
            uniteName: item[0],
            count: item[1],
        }))
    } catch (error) {
        throw new Error(String(error))
    }
}

export async function getDashboardByUniteAndType(): Promise<UniteTypeCount[]> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        const { data } = await api.get("/dashboard/getDashboardByUniteAndType", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        // Transform the data to a more usable format
        return data.map((item: [string, string, number]) => ({
            uniteName: item[0],
            typeName: item[1],
            count: item[2],
        }))
    } catch (error) {
        throw new Error(String(error))
    }
}