import { useState } from "react";
import { buildUrl } from "../utils/api";

export function usePost<T = unknown>(path: string): {
    post: (body: BodyInit) => Promise<T>;
    loading: boolean;
    error: Error | null;
} {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const post = async (body: BodyInit): Promise<T> => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(buildUrl(path), {
                method: "POST",
                body,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message ?? res.statusText);
            }
            return await res.json();
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { post, loading, error };
}
