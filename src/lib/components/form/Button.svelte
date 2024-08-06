<script lang="ts">

    export let name: string
    export let color: string
    export let hoverColor: string
    export let activeColor: string
    export let action: () => void

    let className: string = ''

    export { className as class }
</script>

<button class="colorable-button {className}" style="--btn-color: {color}; --btn-hover-color: {hoverColor}; --btn-active-color: {activeColor};" name={name} on:click={action}>
    <slot />
</button>

<style lang="postcss">
    .colorable-button {
        background-color: var(--btn-color);
        box-shadow: 0px 3px 0px 0px var(--btn-active-color);
        @apply rounded-lg p-2 px-4 w-fit mb-[3px];
    }

    .colorable-button:hover {
        background-color: var(--btn-hover-color);
        box-shadow: 0px 3px 0px 0px var(--btn-active-color);
        @apply rounded-lg p-2 px-4 w-fit mb-[3px];
    }

    .colorable-button:active {
        background-color: var(--btn-active-color);
        box-shadow: 0px 3px 0px 0px var(--btn-active-color);
        @apply rounded-lg p-2 px-4 w-fit mb-[3px];
    }
</style>
