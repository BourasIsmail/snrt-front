import {Materiel} from "@/app/types/Materiel";
import {getCookie} from "cookies-next";
import {api} from "@/app/api/index";

export async function getMaterielByUnite(id: number): Promise<Materiel[]> {
    try{
        const token = getCookie("token");
        if (!token) {
            throw new Error("No authentication token found")
        }
        const { data } = await api.get("/materiel/byUnite/"+id ,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return data
    }catch(error){
        throw new Error(String(error))
    }
}

export async function getMateriel(id: number): Promise<Materiel> {
    try{
        const token = getCookie("token");
        if (!token) {
            throw new Error("No authentication token found")
        }
        const { data } = await api.get("/materiel/get/"+id ,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return data
    }
    catch(error){
        throw new Error(String(error))
    }
}

export async function deleteMateriel(id: number): Promise<string> {
    try{
        const token = getCookie("token");
        if (!token) {
            throw new Error("No authentication token found")
        }
        await api.delete("/materiel/delete/"+id ,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return "Materiel deleted successfully"
    }catch(error){
        throw new Error(String(error))
    }
}

export async function updateMateriel(materiel: Materiel): Promise<Materiel> {
    try {
        const token = getCookie("token")
        if (!token) {
            throw new Error("No authentication token found")
        }

        const { data } = await api.put(`/materiel/update/${materiel.id}`, materiel, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return data
    } catch (error) {
        throw new Error(String(error))
    }
}
