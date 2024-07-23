import type { ConsumableData } from '$lib';

export function load({ url }) {
    let consumableObj: ConsumableData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        consumableObj = JSON.parse(atob(decodeURIComponent(code))) as ConsumableData
    }

    return {
        consumableData: consumableObj
    };
}