import {Roles} from "@/app/types/Roles";

export type User = {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    roles?: Roles[];
}