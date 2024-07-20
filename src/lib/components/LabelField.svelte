<script lang="ts">
    export let name: string;
    export let label: string;
    export let value: string;
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
            on:input
        />
        <slot name="after-input"></slot>
    </div>
</div>
