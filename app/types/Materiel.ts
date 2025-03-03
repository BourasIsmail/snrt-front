import {Type} from "@/app/types/Type";
import {Unite} from "@/app/types/Unite";

export type Materiel = {
    id ?: number;
    designation ?: string;
    marque ?: string;
    model ?: string;
    serialNumber ?: string;
    quantity ?: number;
    numMarche ?: string;
    etat ?: string;
    selected ?: boolean;
    type ?: Type;
    unite ?: Unite;
}