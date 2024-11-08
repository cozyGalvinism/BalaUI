<script lang="ts">
    import { DeckEditor } from "$lib/components"
    import type { PageData } from "./$types"
    
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>
<div class="mt-4">
    <DeckEditor initialDeckData={data.deckData} />
</div>