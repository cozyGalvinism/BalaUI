export const optional: <T>() => T | undefined = () => undefined;

export type Option<T> = { label: string; value: T };
