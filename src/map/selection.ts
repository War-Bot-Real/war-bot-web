import type { Nation } from "../types/Nation";
import type { Selection } from "../types/Selection";
import type { Territory } from "../types/Territory";

export interface TerritoryClickModifiers {
    ctrlKey: boolean;
    shiftKey: boolean;
}

function normalizeTerritorySelection(territories: Territory[]): Selection {
    if (territories.length === 0) return null;
    if (territories.length === 1) {
        return { type: "territory", territory: territories[0] };
    }
    return { type: "territories", territories };
}

function toggleNationTerritories(
    selection: Selection,
    nationTerritories: Territory[],
): Selection {
    if (nationTerritories.length === 0) return selection;

    const selectedTerritories =
        selection?.type === "territory"
            ? [selection.territory]
            : selection?.type === "territories"
              ? selection.territories
              : [];
    const selectedNames = new Set(
        selectedTerritories.map((territory) => territory.name),
    );
    const nationNames = new Set(
        nationTerritories.map((territory) => territory.name),
    );
    const nationAlreadySelected = nationTerritories.every((territory) =>
        selectedNames.has(territory.name),
    );

    if (nationAlreadySelected) {
        return normalizeTerritorySelection(
            selectedTerritories.filter(
                (territory) => !nationNames.has(territory.name),
            ),
        );
    }

    const mergedTerritories = new Map(
        [...selectedTerritories, ...nationTerritories].map((territory) => [
            territory.name,
            territory,
        ]),
    );

    return normalizeTerritorySelection([...mergedTerritories.values()]);
}

export function getSelectionAfterTerritoryClick(
    selection: Selection,
    clickedTerritory: Territory,
    territories: Territory[],
    nations: Nation[],
    modifiers: TerritoryClickModifiers,
    nationSelectMode: boolean,
): Selection {
    const nation = nations.find(
        (item) => item.name === clickedTerritory.nation,
    );

    if (modifiers.ctrlKey && modifiers.shiftKey) {
        const nationTerritories = territories.filter(
            (territory) => territory.nation === clickedTerritory.nation,
        );
        const selectedTerritories =
            selection?.type === "territory"
                ? [selection.territory]
                : selection?.type === "territories"
                  ? selection.territories
                  : [];
        const selectedNames = new Set(
            selectedTerritories.map((territory) => territory.name),
        );
        const additions = nationTerritories.filter(
            (territory) => !selectedNames.has(territory.name),
        );

        if (additions.length === 0) return selection;

        const mergedTerritories = new Map(
            [...selectedTerritories, ...additions].map((territory) => [
                territory.name,
                territory,
            ]),
        );

        return normalizeTerritorySelection([
            ...mergedTerritories.values(),
        ]);
    }

    if (modifiers.shiftKey) {
        return nation ? { type: "nation", nation } : selection;
    }

    if (modifiers.ctrlKey) {
        if (nationSelectMode) {
            const nationTerritories = territories.filter(
                (territory) => territory.nation === clickedTerritory.nation,
            );
            return toggleNationTerritories(selection, nationTerritories);
        }

        if (selection === null) {
            return {
                type: "territories",
                territories: [clickedTerritory],
            };
        }

        if (selection.type === "nation") {
            return { type: "territory", territory: clickedTerritory };
        }

        const selectedTerritories =
            selection.type === "territory"
                ? [selection.territory]
                : selection.territories;

        const isSelected = selectedTerritories.some(
            (territory) => territory.name === clickedTerritory.name,
        );

        if (isSelected) {
            return normalizeTerritorySelection(
                selectedTerritories.filter(
                    (territory) => territory.name !== clickedTerritory.name,
                ),
            );
        }

        return normalizeTerritorySelection([
            ...selectedTerritories,
            clickedTerritory,
        ]);
    }

    if (nationSelectMode) {
        if (!nation) return selection;
        return selection?.type === "nation" &&
            selection.nation.name === nation.name
            ? null
            : { type: "nation", nation };
    }

    return { type: "territory", territory: clickedTerritory };
}
