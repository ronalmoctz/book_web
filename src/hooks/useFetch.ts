import { useState, useEffect, useRef } from "react";
import { buildUrl } from "../utils/api";

export function useFetch<T = unknown>(path: string, deps: unknown[] = []): {
    data: T | null;
    loading: boolean;
    error: Error | null;
    cancelRequest: () => void;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchData = async () => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(buildUrl(path), {
                signal: controller.signal,
            });
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const json: T = await res.json();
            setData(json);
        } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        return () => controllerRef.current?.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    const cancelRequest = () => {
        controllerRef.current?.abort();
        setLoading(false);
    };

    return { data, loading, error, cancelRequest };
}