<script lang="ts">
    import { DeckEditor } from "$lib/components"
    import type { PageData } from "./$types"
    
    export let data: PageData
</script>
<div class="mt-4">
    <DeckEditor initialDeckData={data.deckData} />
</div>