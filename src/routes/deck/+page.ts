import { fromShareCode, stripFormatting, type DeckData } from '$lib';

export const prerender = false;

export function load({ url }) {
    let deckObj: DeckData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        deckObj = fromShareCode(decodeURIComponent(code))
    }

    if (deckObj === null) {
        return {
            deckData: null
        };
    }

    return {
        deckData: deckObj,
        title: `Deck - ${deckObj?.locName}`,
        description: stripFormatting(deckObj?.locText ?? '')
    };
}