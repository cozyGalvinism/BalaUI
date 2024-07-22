<script lang="ts">
    import JokerEditor from "$lib/components/JokerEditor.svelte"
    import type { PageData } from "./$types"

    export let data: PageData
</script>

<div class="mt-4">
    <JokerEditor initialJokerData={data.jokerData} />
</div>