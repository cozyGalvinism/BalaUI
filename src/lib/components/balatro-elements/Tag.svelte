<script lang="ts">
    import { JumpingText } from "$lib/components"

    export let text
    export let colour
    export let shadowColour;
</script>

<div
    class="colorable text-white min-w-24 w-fit p-[0.1rem] px-3"
    style="--colour: {colour}; --shadowColour: {shadowColour}"
>
    <p class="text-center">
        <JumpingText {text} className="flex justify-center text-2xl" />
    </p>
</div>

<style lang="postcss">
    .colorable {
        background-color: var(--colour);
        border-radius: 0.8rem;
        box-shadow: 0px 3px 0px 0px var(--shadowColour);
        @apply mb-[3px];
    }
</style>
