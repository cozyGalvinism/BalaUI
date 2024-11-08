<script lang="ts">
    import type { Snippet } from "svelte"

    interface Props {
        name: string;
        label: string;
        value: string;

        afterInput?: Snippet;

        onInput?: () => void;
    }

    let { name, label, value = $bindable(), afterInput, onInput }: Props = $props();
</script>

<div class="flex flex-col">
    <label for="{name}">{label}</label>
    <div class="flex flex-row gap-2">
        <input
            id="{name}"
            name="{name}"
            type="text"
            bind:value={value}
            class="text-black pl-2 rounded-lg shadow-[0_3px_0_0_#cccccc] flex-1"
            oninput={onInput}
        />
        {@render afterInput?.()}
    </div>
</div>
