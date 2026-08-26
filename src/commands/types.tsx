export type CommandContext =
    | "general"
    | "territory"
    | "nation";

export interface Command {
    id: string;
    name: string;
    context: CommandContext;
}