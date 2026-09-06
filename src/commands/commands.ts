import type { Command } from "./types";

export const commands: Command[] = [
    {
        id: "shop",
        name: "Shop",
        context: "general",
        requiresNation: false
    },
    {
        id: "settax",
        name: "Set Tax",
        context: "general",
        requiresNation: true
    },
    {
        id: "collect",
        name: "Collect Income",
        context: "general",
        requiresNation: true
    },
    {
        id: "income",
        name: "View Income",
        context: "general",
        requiresNation: true
    },
    {
        id: "deploy",
        name: "Deploy Unit",
        context: "territory",
        requiresNation: true
    },
    {
        id: "bal",
        name: "View Balance",
        context: "general",
        requiresNation: true
    },
    {
        id: "buy",
        name: "Buy",
        context: "general",
        requiresNation: true
    },
    {
        id: "inv",
        name: "Inventory",
        context: "general",
        requiresNation: true
    },
    {
        id: "territories",
        name: "Territories",
        context: "nation",
        requiresNation: false
    },
    {
        id: "top",
        name: "Top",
        context: "general",
        requiresNation: false
    },
    {
        id: "declarewar",
        name: "Declare War",
        context: "nation",
        requiresNation: true
    },
    {
        id: "wars",
        name: "Wars",
        context: "general",
        requiresNation: false
    },
    {
        id: "resign",
        name: "Resign",
        context: "general",
        requiresNation: true
    },
    {
        id: "attack",
        name: "Attack",
        context: "territory",
        requiresNation: true
    },
    {
        id: "give",
        name: "Give",
        context: "nation",
        requiresNation: true
    },
    {
        id: "build",
        name: "Build",
        context: "territory",
        requiresNation: true
    },
    {
        id: "borders",
        name: "Borders",
        context: "territory", //Also for nation
        requiresNation: false
    }
];