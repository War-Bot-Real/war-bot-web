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
