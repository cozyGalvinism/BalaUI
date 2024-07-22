<script lang="ts">
    import type { Option } from "$lib"

    export let name: string;
    export let label: string;
    export let value: any;
    export let options: Option<any>[];
</script>

<div class="flex flex-col">
    <label for="{name}">{label}</label>
    <select
        id="{name}"
        name="{name}"
        bind:value={value}
        class="text-black pl-2 rounded-lg h-8 shadow-[0_3px_0_0_#cccccc]"
        on:change
    >
        {#each options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
</div>