import type { Command } from "./types";

export const commands: Command[] = [
    {
        id: "shop",
        name: "Shop",
        context: "general",
    },

    {
        id: "balance",
        name: "Balance",
        context: "general",
    },

    {
        id: "inventory",
        name: "Inventory",
        context: "general",
    },

    {
        id: "build",
        name: "Build",
        context: "territory",
    },

    {
        id: "move",
        name: "Move",
        context: "territory",
    },

    {
        id: "attack",
        name: "Attack",
        context: "territory",
    },

    {
        id: "declare-war",
        name: "Declare War",
        context: "nation",
    },

    {
        id: "ally",
        name: "Ally",
        context: "nation",
    },
];