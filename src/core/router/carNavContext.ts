import { createContext, useContext } from "react";

export type CarCategory = "music" | "settings";

export interface CarStackEntry {
    key: string;
    route: string;
    params?: any;
}

export interface CarNavContextValue {
    stack: CarStackEntry[];
    category: CarCategory;
    currentParams: any;
    canPop: boolean;
    push: (route: string, params?: any) => void;
    pop: () => void;
    selectCategory: (category: CarCategory) => void;
}

export const CarNavContext = createContext<CarNavContextValue | null>(null);

export function useCarNav() {
    return useContext(CarNavContext);
}
