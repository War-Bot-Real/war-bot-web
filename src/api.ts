const API_URL = "https://war-bot-api.vercel.app";

export async function getNations() {
    const response = await fetch(`${API_URL}/nations`);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export async function getTerritories() {
    const response = await fetch(`${API_URL}/territories`);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export interface MapResponse {
    url: {
        signedURL: string;
        signedUrl: string;
    };
}

export async function getMapUrl(shrink: boolean): Promise<string> {
    const response = await fetch(`${API_URL}/map/expanded_europe/${shrink}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch map: ${response.status}`);
    }

    const data: MapResponse = await response.json();

    return data.url.signedUrl;
}

export async function getShop() {
    const response = await fetch(`${API_URL}/shop`);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}