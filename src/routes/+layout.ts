import { browser } from "$app/environment";
import '$lib/i18n'
import { locale, waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export async function load() {
    if (browser) {
        locale.set(window.navigator.language)
    }

    await waitLocale()
}