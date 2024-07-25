import { fromShareCode, stripFormatting, type ConsumableData } from '$lib';

export const prerender = false;

export function load({ url }) {
    let consumableObj: ConsumableData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        consumableObj = fromShareCode(decodeURIComponent(code))
    }

    if (consumableObj === null) {
        return {
            consumableData: null
        };
    }

    return {
        consumableData: consumableObj,
        title: `Consumable - ${consumableObj?.locName}`,
        description: stripFormatting(consumableObj?.locText ?? '')
    };
}