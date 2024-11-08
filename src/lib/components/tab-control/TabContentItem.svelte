<script lang="ts">
    
    interface Props {
        activeTabValue: number;
        id: number;
        class?: string;
        children?: import('svelte').Snippet;
    }

    let {
        activeTabValue,
        id,
        class: className = 'p-4 bg-gray-50 rounded-lg',
        children
    }: Props = $props();
    
</script>

{#if activeTabValue === id}
    <div class="{className}">
        {@render children?.()}
    </div>
{/if}
