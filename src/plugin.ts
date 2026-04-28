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
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    React.createElement("rect", { x: 3, y: 3, width: 7, height: 7 }),
    React.createElement("rect", { x: 14, y: 3, width: 7, height: 7 }),
    React.createElement("rect", { x: 3, y: 14, width: 7, height: 7 }),
    React.createElement("rect", { x: 14, y: 14, width: 7, height: 7 })
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
