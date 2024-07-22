<script lang="ts">
    export let name: string;
    export let label: string;
    export let value: boolean;

    function flip() {
        value = !value
    }
</script>

<div class="flex flex-row gap-2" on:click={flip}>
    <input id="{name}" class="w-6" type="checkbox" name="{name}" bind:checked={value}>
    <label for="{name}" on:click={flip}>{label}</label>
</div>