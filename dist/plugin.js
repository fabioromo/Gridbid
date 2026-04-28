import React from "react";
import GridbidSidebar from "./components/GridbidSidebar";
import GridbidRoot from "./components/GridbidRoot";
import { GridbidServiceProvider } from "./services/GridbidServiceContext";
import { mockGridbidService } from "./services/mockGridbidService";
const GridbidIcon = () => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
}, React.createElement("rect", { x: 3, y: 3, width: 7, height: 7 }), React.createElement("rect", { x: 14, y: 3, width: 7, height: 7 }), React.createElement("rect", { x: 3, y: 14, width: 7, height: 7 }), React.createElement("rect", { x: 14, y: 14, width: 7, height: 7 }));
export function createGridbidPlugin(config) {
    const service = config?.service ?? mockGridbidService;
    const Main = () => React.createElement(GridbidServiceProvider, { service }, React.createElement(GridbidRoot, null));
    return {
        id: "gridbid",
        name: "Gridbid",
        icon: GridbidIcon,
        sidebar: GridbidSidebar,
        main: Main,
    };
}
