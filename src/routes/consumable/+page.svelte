<script lang="ts">
    import { version } from "$app/environment"
    import { stripFormatting } from "$lib"
    import ConsumableEditor from "$lib/components/ConsumableEditor.svelte"
    import type { PageData } from "./$types"

    export let data: PageData
</script>

<div class="mt-4">
    <ConsumableEditor initialConsumableData={data.consumableData} />
</div>