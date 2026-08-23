export function parseLocation(location: string): [number, number][] {
    const matches = location.matchAll(/\((\d+),\s*(\d+)\)/g);

    return Array.from(matches, (match) => [
        Number(match[1]),
        Number(match[2]),
    ]);
}