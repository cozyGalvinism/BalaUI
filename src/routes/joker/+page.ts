import { stripFormatting, type JokerData } from '$lib';

export const prerender = false;

export function load({ url }) {
    let jokerObj: JokerData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        jokerObj = JSON.parse(atob(decodeURIComponent(code))) as JokerData
    }

    if (jokerObj === null) {
        return {
            jokerData: null
        };
    }

    return {
        jokerData: jokerObj,
        title: `Joker - ${jokerObj?.locName}`,
        description: stripFormatting(jokerObj?.locText ?? '')
    };
}