import React, { createContext, useContext } from "react";
import type { GridbidService } from "./gridbidService";

const GridbidServiceContext = createContext<GridbidService | null>(null);

export function GridbidServiceProvider({
  service,
  children,
}: {
  service: GridbidService;
  children: React.ReactNode;
}) {
  return (
    <GridbidServiceContext.Provider value={service}>
      {children}
    </GridbidServiceContext.Provider>
  );
}

export function useGridbidService(): GridbidService {
  const service = useContext(GridbidServiceContext);
  if (!service) {
    throw new Error("useGridbidService must be used within a GridbidServiceProvider");
  }
  return service;
}
