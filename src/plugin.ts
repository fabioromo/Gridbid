import React from "react";
import GridbidSidebar from "./components/GridbidSidebar";
import GridbidRoot from "./components/GridbidRoot";
import { GridbidServiceProvider } from "./services/GridbidServiceContext";
import type { GridbidService } from "./services/gridbidService";
import { mockGridbidService } from "./services/mockGridbidService";

export interface GridbidPluginConfig {
  service?: GridbidService;
}

/**
 * Official GridAI plugin interface.
 * TODO: replace with `import type { GridAIPlugin } from '@gridwork/gridai-sdk'`
 * once the SDK is published. This must stay in sync with the host's definition.
 */
export interface GridAIPlugin {
  id: string;
  name: string;
  icon: React.ComponentType;
  sidebar: React.ComponentType;
  contextProvider?: (userMessage: string) => Promise<string>;
}

/** Concrete shape returned by this plugin — extends the standard interface with a main content component. */
export interface GridbidPluginShape extends GridAIPlugin {
  main: React.ComponentType;
}

const GridbidIcon: React.ComponentType = () =>
  React.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 20, height: 20, viewBox: "0 0 24 24", fill: "#4782f3" },
    // Cross — 5 large dots
    React.createElement("circle", { cx: 12, cy: 12,   r: 2.63 }),
    React.createElement("circle", { cx: 12, cy: 7,    r: 2.63 }),
    React.createElement("circle", { cx: 12, cy: 17,   r: 2.63 }),
    React.createElement("circle", { cx: 7,  cy: 12,   r: 2.63 }),
    React.createElement("circle", { cx: 17, cy: 12,   r: 2.63 }),
    // Diagonal — 4 medium dots
    React.createElement("circle", { cx: 7,  cy: 7,    r: 2.07 }),
    React.createElement("circle", { cx: 17, cy: 7,    r: 2.07 }),
    React.createElement("circle", { cx: 7,  cy: 17,   r: 2.07 }),
    React.createElement("circle", { cx: 17, cy: 17,   r: 2.07 }),
    // Cardinal far — 4 medium-small dots
    React.createElement("circle", { cx: 12, cy: 1.84, r: 1.84 }),
    React.createElement("circle", { cx: 12, cy: 22.2, r: 1.84 }),
    React.createElement("circle", { cx: 1.84, cy: 12, r: 1.84 }),
    React.createElement("circle", { cx: 22.2, cy: 12, r: 1.84 }),
    // Outer ring — 8 small dots
    React.createElement("circle", { cx: 7,    cy: 1.84, r: 1.22 }),
    React.createElement("circle", { cx: 17,   cy: 1.84, r: 1.22 }),
    React.createElement("circle", { cx: 7,    cy: 22.2, r: 1.22 }),
    React.createElement("circle", { cx: 17,   cy: 22.2, r: 1.22 }),
    React.createElement("circle", { cx: 1.84, cy: 7,    r: 1.22 }),
    React.createElement("circle", { cx: 22.2, cy: 7,    r: 1.22 }),
    React.createElement("circle", { cx: 1.84, cy: 17,   r: 1.22 }),
    React.createElement("circle", { cx: 22.2, cy: 17,   r: 1.22 }),
  );

export function createGridbidPlugin(
  config?: GridbidPluginConfig
): GridbidPluginShape {
  const service: GridbidService = config?.service ?? mockGridbidService;

  const Main: React.ComponentType = () =>
    React.createElement(
      GridbidServiceProvider,
      { service },
      React.createElement(GridbidRoot, null)
    );

  return {
    id: "gridbid",
    name: "Gridbid",
    icon: GridbidIcon,
    sidebar: GridbidSidebar,
    main: Main,
  };
}
