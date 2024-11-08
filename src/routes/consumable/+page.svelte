<script lang="ts">
    import { version } from "$app/environment"
    import { stripFormatting } from "$lib"
    import { ConsumableEditor } from "$lib/components"
    import type { PageData } from "./$types"

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<div class="mt-4">
    <ConsumableEditor initialConsumableData={data.consumableData} />
</div>