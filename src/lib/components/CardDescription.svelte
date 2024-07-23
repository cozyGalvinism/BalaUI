<script lang="ts">
    import { optional } from '$lib'
    import { onMount } from 'svelte'
    import JumpingText from './JumpingText.svelte'
    import FormattedText from './FormattedText.svelte'
    import Tag from './Tag.svelte'
    import { text } from '@sveltejs/kit'

    export let name: string
    export let description: string
</script>

<div
    class="flex flex-col gap-2 rounded-lg bg-[#374244] border-[#D8D8D8] border-2 m6x11plus w-fit p-1 pt-0 shadow"
>
    <h1 class="text-4xl m-2 mx-6 mb-0">
        <JumpingText
            className="flex justify-center tracking-widest -mr-2"
            text={name}
        />
    </h1>

    <div class="bg-white text-[#374244] rounded-lg min-w-24 description-shadow">
        <p class="p-2 text-2xl text-center leading-[0.8]">
            <FormattedText text={description} />
        </p>
    </div>

    <div class="flex justify-center">
        <slot />
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
