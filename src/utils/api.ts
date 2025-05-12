import { API_URL } from "@/constants/api";

export function buildUrl(path: string): string {
    return `${API_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}