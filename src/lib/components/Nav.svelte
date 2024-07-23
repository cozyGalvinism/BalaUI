<script lang="ts">
    import { base } from '$app/paths'
    import { page } from '$app/stores'
    import { _ } from 'svelte-i18n';

    let links = [
        { href: '/', text: $_('nav.home') },
        { href: '/joker', text: $_('nav.joker') },
        { href: '/consumable', text: $_('nav.consumable') },
    ]
</script>

<nav>
    <ul class="m6x11plus flex flex-row gap-4 text-2xl">
        {#each links as link}
            <li>
                {#if $page.url.pathname === base + link.href}
                    <p class="underline underline-offset-4">{link.text}</p>
                {:else}
                    <a href="{base}{link.href}">{link.text}</a>
                {/if}
            </li>
        {/each}
    </ul>
</nav>
