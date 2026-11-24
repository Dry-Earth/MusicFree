import { createContext, useContext } from "react";

export interface CarStackEntry {
    key: string;
    route: string;
    params?: any;
}

export interface CarNavContextValue {
    stack: CarStackEntry[];
    currentParams: any;
    canPop: boolean;
    push: (route: string, params?: any) => void;
    pop: () => void;
}

export const CarNavContext = createContext<CarNavContextValue | null>(null);

export function useCarNav() {
    return useContext(CarNavContext);
}
