<script lang="ts">
    import { version } from "$app/environment"
    import { stripFormatting } from "$lib"
    import { JokerEditor } from "$lib/components"
    import type { PageData } from "./$types"

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<div class="mt-4">
    <JokerEditor initialJokerData={data.jokerData} />
</div>