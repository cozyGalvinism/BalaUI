<script lang="ts">
    import { page } from "$app/stores";

    let links = [
        { href: "/joker", text: "Create Joker" },
    ];
</script>

<nav>
    <div class="w-full">
        <ul class="m6x11plus flex flex-row gap-4 text-2xl">
            <li>
                {#each links as link}
                    {#if $page.url.pathname === link.href}
                        <p class="active">{link.text}</p>
                    {:else}
                        <a href={link.href}>{link.text}</a>
                    {/if}
                {/each}
            </li>
        </ul>
    </div>
</nav>

<style lang="postcss">
    .active {
        @apply underline underline-offset-4;
    }
</style>
