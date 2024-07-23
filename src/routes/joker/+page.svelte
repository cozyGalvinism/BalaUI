<script lang="ts">
    import { version } from "$app/environment"
    import { stripFormatting } from "$lib"
    import JokerEditor from "$lib/components/JokerEditor.svelte"
    import type { PageData } from "./$types"

    export let data: PageData
</script>

<svelte:head>
    {#if data.jokerData}
        <title>Joker - {data.jokerData.locName}</title>
        <meta name="description" content="{stripFormatting(data.jokerData.locText)}">
        <meta name="author" content="cozyGalvinism">
    {:else}
        <title>BalaUI v{version}</title>
        <meta name="author" content="cozyGalvinism">
        <meta name="description" content="Create a new joker">
    {/if}
</svelte:head>

<div class="mt-4">
    <JokerEditor initialJokerData={data.jokerData} />
</div>