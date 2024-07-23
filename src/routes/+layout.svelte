<script lang="ts">
    import BalatroBackground from '$lib/components/BalatroBackground.svelte'
    import Nav from '$lib/components/Nav.svelte'
    import Settings from '$lib/components/Settings.svelte'
    import { settings } from '$lib/stores'
    import { onMount } from 'svelte'
    import '../app.css'
    import { version } from '$app/environment'

    onMount(() => {
        console.log('hello fellow developer!')
    })
</script>

<svelte:head>
    <title>BalaUI v{version}</title>
    <meta name="author" content="cozyGalvinism">
    <meta name="description" content="A set of modding utilities for Balatro and Steamodded">
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
            <a class="underline underline-offset-4 text-2xl" target="_blank" href="https://github.com/cozyGalvinism/BalaUI">GitHub</a>
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
