import type { LanguageType } from "svelte-highlight/languages";
import pako from 'pako';

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

export type VoucherData = {
    key: string;
    locName: string;
    locText: string;
    atlas: string;
    cost: number;
    posX: number;
    posY: number;
    unlocked: boolean;
    discovered: boolean;
    requires: string[];

    previewVariables: PreviewVariable[];
    localization: LocalizationEntry[];
}

export type DeckData = {
    key: string;
    locName: string;
    locText: string;
    atlas: string;
    posX: number;
    posY: number;
    unlocked: boolean;
    discovered: boolean;
    
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

function uint8ArrayToRaw(uint8Array: Uint8Array): string {
    return String.fromCharCode(...uint8Array);
}

function rawToUint8Array(raw: string): Uint8Array {
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
}

export function toShareCode<T extends object>(obj: T) {
    const jsonString = JSON.stringify(obj)
    const compressedUint8 = pako.deflate(jsonString)
    const code = btoa(uint8ArrayToRaw(compressedUint8))

    return encodeURIComponent(code)
}

export function fromShareCode(code: string) {
    const compressed = rawToUint8Array(atob(decodeURIComponent(code)))
    const decompressed = pako.inflate(compressed)
    const decompressedString = new TextDecoder().decode(decompressed);

    return JSON.parse(decompressedString)
}
