import type { Command } from "./types";

export const commands: Command[] = [
    {
        id: "shop",
        name: "Shop",
        context: "general",
    },
    {
        id: "settax",
        name: "Set Tax",
        context: "general",
    },
    {
        id: "collect",
        name: "Collect Income",
        context: "general",
    },
    {
        id: "deploy",
        name: "Deploy Unit",
        context: "territory",
    },
    {
        id: "bal",
        name: "View Balance",
        context: "general",
    },
    {
        id: "buy",
        name: "Buy",
        context: "general",
    },
    {
        id: "inv",
        name: "Inventory",
        context: "general",
    },
    {
        id: "territories",
        name: "Territories",
        context: "nation",
    },
    {
        id: "top",
        name: "Top",
        context: "general",
    },
    {
        id: "declarewar",
        name: "Declare War",
        context: "nation",
    },
    {
        id: "wars",
        name: "Wars",
        context: "general",
    },
    {
        id: "resign",
        name: "Resign",
        context: "general",
    },
    {
        id: "attack",
        name: "Attack",
        context: "territory",
    },
    {
        id: "give",
        name: "Give",
        context: "nation",
    },
    {
        id: "build",
        name: "Build",
        context: "territory",
    },
    {
        id: "borders",
        name: "Territory Borders",
        context: "territory",
    },
    {
        id: "bordersnat",
        name: "Nation Borders",
        context: "nation",
    }
];