export const optional: <T>() => T | undefined = () => undefined;

export type Option<T> = { label: string; value: T };

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

export type PreviewVariable = {
    name: string
    value: string
}

export type LocalizationEntry = {
    name: string
    text: string
    locale: string
}

