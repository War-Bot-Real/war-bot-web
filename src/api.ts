import { supabase } from "./lib/supabase";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

const API_URL = "https://war-bot-api.vercel.app";

async function fetchRequest(request: string, method: HttpMethod = "GET", body?: object) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error("User is not logged in");
    }

    const response = await fetch(`${API_URL}/${request}`, {
        method,
        headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || `API error: ${response.status}`);
    }

    return data;
}

export async function getNations() {
    return fetchRequest('nations');
}

export async function getNation(nation: string) {
    return fetchRequest(`nation/${nation}`);
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

export async function setTax(rate: number) {
    return fetchRequest(`settax/${rate}`, "PATCH");
}

export async function getBalance() {
    return fetchRequest(`bal`);
}

export async function getInventory() {
    return fetchRequest(`inv`);
}

export async function getBorders(territory: string) {
    return fetchRequest(`borders/terr/${territory}`);
}

export async function getNationBorders(nation: string) {
    return fetchRequest(`borders/nation/${nation}`);
}

export async function collect() {
    return fetchRequest(`income/collect`, "POST");
}

export async function getIncome() {
    return fetchRequest(`income/view`);
}

export async function buy(item: string, quantity: number) {
    return fetchRequest(`buy`, "POST", {item, quantity});
}

export async function deploy(territory: string, unit: string, quantity: number) {
    return fetchRequest(`deploy`, "POST", {territory, unit, quantity});
}