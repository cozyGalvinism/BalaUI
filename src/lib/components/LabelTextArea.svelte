<script lang="ts">
    export let name: string;
    export let label: string;
    export let value: string;
</script>

<div class="flex flex-col">
    <label for="{name}">{label}</label>
    <textarea
        id="{name}"
        name="{name}"
        bind:value={value}
        class="text-black pl-2 rounded-lg min-h-[100px] shadow-[0_3px_0_0_#cccccc]"
    />
</div>