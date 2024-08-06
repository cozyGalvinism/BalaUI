<script lang="ts">
    import { BalatroBackground, Nav, Settings } from '$lib/components'
    import { settings } from '$lib/stores'
    import { onMount } from 'svelte'
    import '../app.css'
    import { version } from '$app/environment'
    import { page } from '$app/stores'
    import {_} from 'svelte-i18n'
    import { injectSpeedInsights } from '@vercel/speed-insights'

    injectSpeedInsights()

    onMount(() => {
        console.log('hello fellow developer!')
    })
</script>

<svelte:head>
    {#if $page.data.title}
        <title>{$page.data.title} - BalaUI v{version}</title>
        <meta property="og:title" content="{$page.data.title} - BalaUI v{version}" />
    {:else}
        <title>BalaUI v{version}</title>
        <meta property="og:title" content="BalaUI v{version}" />
    {/if}

    {#if $page.data.description}
        <meta name="description" content={$page.data.description} />
        <meta property="og:description" content={$page.data.description} />
    {:else}
        <meta name="description" content="A set of modding utilities for Balatro and Steamodded" />
        <meta property="og:description" content="A set of modding utilities for Balatro and Steamodded" />
    {/if}
    <meta property="og:url" content="{$page.url.toString()}" />
    <meta property="og:image" content="https://cozygalvinism.github.io/BalaUI/favicon.png" />
    <meta name="author" content="cozyGalvinism">
    <meta property="og:type" content="website" />
</svelte:head>

<div class="{$settings.crt ? 'crt-scanlines' : ''}" style="--scanline-opacity: 0.05"></div>
<BalatroBackground pixelate={!$settings.smoothBackground} />

<div class="relative p-4">
    <header class="flex justify-between">
        <Nav />
        <Settings />
    </header>

    <main class="m6x11plus pt-2">
        <slot />
    </main>

    <footer class="m6x11plus mt-4">
        <div class="flex flex-row gaps-4">
            <a class="underline underline-offset-4 text-2xl" target="_blank" href="https://github.com/cozyGalvinism/BalaUI">{$_('footer.github')}</a>
        </div>
    </footer>
</div>

<style lang="postcss">
    .crt-scanlines::before {
        content: ' ';
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(rgba(255, 0, 0, var(--scanline-opacity)) 33%, rgba(0, 255, 0, var(--scanline-opacity)) 66%, rgba(0, 0, 255, var(--scanline-opacity)) 100%);
        z-index: 100;
        background-size:
            100% 6px,
            6px 100%;
        pointer-events: none;
        width: 100%;
        height: 100%;
    }
</style>
