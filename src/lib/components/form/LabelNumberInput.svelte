<script lang="ts">
    interface Props {
        name: string;
        label: string;
        value: number;
        min?: number;
        max?: number;
        step?: number;

        onInput?: () => void;
    }

    let {
        name,
        label,
        value = $bindable(),
        min = 0,
        max = 100,
        step = 1,

        onInput
    }: Props = $props();
</script>

<div class="flex flex-col">
    <label for="{name}">{label}</label>
    <input
        id="{name}"
        name="{name}"
        type="number"
        min={min}
        max={max}
        step={step}
        bind:value={value}
        class="text-black pl-2 rounded-lg shadow-[0_3px_0_0_#cccccc]"
        oninput={onInput}
    />
</div>