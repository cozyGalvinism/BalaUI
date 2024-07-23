<script lang="ts">
    import { version } from "$app/environment"
    import { stripFormatting } from "$lib"
    import ConsumableEditor from "$lib/components/ConsumableEditor.svelte"
    import type { PageData } from "./$types"

    export let data: PageData
</script>

<svelte:head>
    {#if data.consumableData}
        <title>Consumable - {data.consumableData.locName}</title>
        <meta name="description" content="{stripFormatting(data.consumableData.locText)}">
        <meta name="author" content="cozyGalvinism">
    {:else}
        <title>BalaUI v{version}</title>
        <meta name="author" content="cozyGalvinism">
        <meta name="description" content="Create a new joker">
    {/if}
</svelte:head>

<div class="mt-4">
    <ConsumableEditor initialConsumableData={data.consumableData} />
</div>