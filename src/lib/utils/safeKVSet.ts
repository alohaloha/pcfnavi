import { kv } from '@/lib/kvClient';

export async function safeKVSet<T>(
    key: string,
    value: T,
    label?: string,
    options: { ex: number } = { ex: 3600 }
): Promise<boolean> {
    try {
        const json = JSON.stringify(value);
        await kv.set(key, json, options);
        return true;
    } catch (error) {
        console.error(`KV保存エラー [${label ?? key}]`, error, value);
        return false;
    }
}
