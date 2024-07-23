<script lang="ts">
    export let name: string;
    export let label: string;
    export let value: number;

    export let min: number = 0;
    export let max: number = 100;
    export let step: number = 1;
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
        on:input
    />
</div>