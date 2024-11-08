<script lang="ts">
    import type { Option } from "$lib"

    interface Props {
        name: string;
        label: string;
        value: any;
        options: Option<any>[];

        onChange?: () => void;
    }

    let {
        name,
        label,
        value = $bindable(),
        options,

        onChange
    }: Props = $props();
</script>

<div class="flex flex-col">
    <label for="{name}">{label}</label>
    <select
        id="{name}"
        name="{name}"
        bind:value={value}
        class="text-black pl-2 rounded-lg h-8 shadow-[0_3px_0_0_#cccccc]"
        onchange={onChange}
    >
        {#each options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
</div>