import type { Territory } from "./Territory";
import type { Nation } from "./Nation";

export type Selection =
    | { type: "territory"; territory: Territory }
    | { type: "nation"; nation: Nation }
    | null;