<script lang="ts">
    import { page } from '$app/stores'

    let links = [
        { href: '/', text: 'Home' },
        { href: '/joker', text: 'Create Joker' },
    ]
</script>

<nav>
    <ul class="m6x11plus flex flex-row gap-4 text-2xl">
        {#each links as link}
            <li>
                {#if $page.url.pathname === link.href}
                    <p class="active">{link.text}</p>
                {:else}
                    <a href={link.href}>{link.text}</a>
                {/if}
            </li>
        {/each}
    </ul>
</nav>

<style lang="postcss">
    .active {
        @apply underline underline-offset-4;
    }
</style>
