import { stripFormatting, type ConsumableData } from '$lib';

export const prerender = false;

export function load({ url }) {
    let consumableObj: ConsumableData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        consumableObj = JSON.parse(atob(decodeURIComponent(code))) as ConsumableData
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