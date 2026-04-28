import React from "react";
import type { GridbidService } from "./services/gridbidService";
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
export declare function createGridbidPlugin(config?: GridbidPluginConfig): GridbidPluginShape;
