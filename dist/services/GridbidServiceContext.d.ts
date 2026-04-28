import React from "react";
import type { GridbidService } from "./gridbidService";
export declare function GridbidServiceProvider({ service, children, }: {
    service: GridbidService;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useGridbidService(): GridbidService;
