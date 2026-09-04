export function parseLocation(location: string[][]): [number, number][] {
    return location.map((coordinate) => [
        Number(coordinate[0]),
        Number(coordinate[1]),
    ]);
}