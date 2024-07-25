import type { LanguageType } from "svelte-highlight/languages";

export const localeList = [
    'de',
    // 'en-us',
    'es_419',
    'es_ES',
    'fr',
    'id',
    'it',
    'ja',
    'ko',
    'nl',
    'pl',
    'pt_BR',
    'ru',
    'zh_CN',
    'zh_TW',
];

export const optional: <T>() => T | undefined = () => undefined;

export type Option<T> = { label: string; value: T };

export type CodeFile = {
    fileName: string;
    content: string;
    lang: LanguageType<string>;
}

export type JokerData = {
    key: string;
    rarity: number;
    discovered: boolean;
    unlocked: boolean;
    atlas: string;
    cost: number;
    blueprintCompat: boolean;
    eternalCompat: boolean;
    perishableCompat: boolean;
    posX: number;
    posY: number;
    locName: string;
    locText: string;

    previewVariables: PreviewVariable[];
    localization: LocalizationEntry[];
};

export type ConsumableData = {
    key: string;
    set: string;
    locName: string;
    locText: string;
    posX: number;
    posY: number;
    atlas: string;
    cost: number;
    unlocked: boolean;
    discovered: boolean;
    hidden: boolean;
    soulSet: string;
    soulRate: number;
    canRepeatSoul: boolean;

    previewVariables: PreviewVariable[];
    localization: LocalizationEntry[];
}

export type PreviewVariable = {
    name: string;
    value: string;
}

export type LocalizationEntry = {
    name: string;
    text: string;
    locale: string;
}

export function stripFormatting(text: string) {
    const regex = /{[A-Za-z0-9:., ]*}/g

    return text.replace(regex, '')
}

