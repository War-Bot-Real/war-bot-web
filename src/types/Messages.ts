export interface Message {
    id: number;
    time: string;
    sender: string | null;
    recipient: string | null;
    type: string;
    message: string;
}