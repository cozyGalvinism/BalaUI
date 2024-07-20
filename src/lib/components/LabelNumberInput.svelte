<script lang="ts">
    export let name: string;
    export let label: string;
    export let value: number;
</script>

<div class="flex flex-col">
    <label for="{name}">{label}</label>
    <input
        id="{name}"
        name="{name}"
        type="number"
        bind:value={value}
        class="text-black pl-2 rounded-lg shadow-[0_3px_0_0_#cccccc]"
    />
</div>