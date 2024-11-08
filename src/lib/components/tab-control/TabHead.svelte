<script lang="ts">
    import type { Snippet } from "svelte"

    interface Props {
        divClass?: string;
        ulClass?: string;

        children?: Snippet;
        afterTabList?: Snippet;
    };

    let { divClass = '', ulClass = 'flex flex-wrap -mb-px gap-2', children, afterTabList }: Props = $props();
</script>

<div class="{divClass}">
    <ul class="{ulClass}" role="tablist">
        {@render children?.()}
    </ul>
    {@render afterTabList?.()}
</div>