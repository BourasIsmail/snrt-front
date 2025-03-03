import {Roles} from "@/app/types/Roles";
import {Unite} from "@/app/types/Unite";

export type User = {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    roles?: Roles[];
    unite?: Unite;
}