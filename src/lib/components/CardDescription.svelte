<script lang="ts">
    import { optional } from '$lib'
    import { onMount } from 'svelte'
    import JumpingText from './JumpingText.svelte'
    import FormattedText from './FormattedText.svelte'
    import Tag from './Tag.svelte'
    import { text } from '@sveltejs/kit'

    export let name: string
    export let description: string
    export let rarity: number
    export let modId = optional<string>()
</script>

<div
    class="flex flex-col gap-2 rounded-lg bg-[#374244] border-[#D8D8D8] border-2 m6x11plus w-fit p-1 pt-0 shadow"
>
    <h1 class="text-4xl m-2 mx-6 mb-0">
        <JumpingText
            className="flex justify-center tracking-widest -mr-2"
            text={name ? name : "Placeholder Joker"}
        />
    </h1>

    <div class="bg-white text-[#374244] rounded-lg min-w-24 description-shadow">
        <p class="p-2 text-2xl text-center leading-[0.8]">
            <FormattedText text={description ? description : "{C:mult}+4{} Mult"} />
        </p>
    </div>

    <div class="flex justify-center">
        {#if rarity == 1}
            <Tag text="Common" colour="#009dff" shadowColour="#007ecc" />
        {:else if rarity == 2}
            <Tag text="Uncommon" colour="#4BC292" shadowColour="#3c9b75" />
        {:else if rarity == 3}
            <Tag text="Rare" colour="#fe5f55" shadowColour="#cb4c44" />
        {:else if rarity == 4}
            <Tag text="Legendary" colour="#b26cbb" shadowColour="#8e5696"  />
        {:else}
            <Tag text="Invalid" colour="#ff00ff" shadowColour="#cc00cc" />
        {/if}
    </div>
</div>

<style lang="postcss">
    .shadow {
        box-shadow: 0px 4px 0px 0px #a1a1a1;
    }

    .description-shadow {
        box-shadow: 0px 4px 0px 0px #bbbbbb;
    }
</style>
