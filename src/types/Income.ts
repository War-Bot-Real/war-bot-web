export interface IncomeResult {
    Income: number;
    "War Debts": number;
    Balance: number;
    Stability: {
        Total: number;
        Change: number;
    };
    "Political Power": {
        Total: number;
        Change: number;
    };
    Resources: Record<string, number>;
    "Collected From": number;
    "Collected Until": number;
}

export type IncomeResponse = { success: true; result: IncomeResult } | { success: false; detail?: string };