import { supabase } from "./lib/supabase";

const API_URL = "https://war-bot-api.vercel.app";

export async function getNations() {
    return fetchRequest('nations');
}

export async function getTerritories() {
    return fetchRequest('territories');
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
    return fetchRequest('shop');
}

export async function me() {
    return fetchRequest('me');
}

async function fetchRequest(request: string) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error("User is not logged in");
    }

    const response = await fetch(`${API_URL}/${request}`, {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}