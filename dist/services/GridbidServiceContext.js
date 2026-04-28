import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const GridbidServiceContext = createContext(null);
export function GridbidServiceProvider({ service, children, }) {
    return (_jsx(GridbidServiceContext.Provider, { value: service, children: children }));
}
export function useGridbidService() {
    const service = useContext(GridbidServiceContext);
    if (!service) {
        throw new Error("useGridbidService must be used within a GridbidServiceProvider");
    }
    return service;
}
