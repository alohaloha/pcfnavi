// lib/utils/safeParse.ts
export function safeParseJson<T = unknown>(
    raw: unknown,
    label: string
): T | null {
    if (!raw) return null;

    if (typeof raw === 'object') {
        return raw as T;
    }

    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw) as T;
        } catch (e) {
            console.error(`JSON parsing error [${label}]:`, e, raw);
            return null;
        }
    }

    console.warn(`Unexpected type for raw data [${label}]:`, typeof raw);
    return null;
}
