import { fromShareCode, stripFormatting, type JokerData } from '$lib';

export const prerender = false;

export function load({ url }) {
    let jokerObj: JokerData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        jokerObj = fromShareCode(decodeURIComponent(code))
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