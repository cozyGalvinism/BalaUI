<script lang="ts">
    import { base } from '$app/paths'
    import { page } from '$app/stores'
    import { onMount } from 'svelte'

    let links = [
        { href: '/', text: 'Home' },
        { href: '/joker', text: 'Create Joker' },
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
