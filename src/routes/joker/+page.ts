import type { JokerData } from '$lib';

export function load({ url }) {
    let jokerObj: JokerData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        jokerObj = JSON.parse(atob(decodeURIComponent(code))) as JokerData
    }

    return {
        jokerData: jokerObj
    };
}