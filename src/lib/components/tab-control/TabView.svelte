<script lang="ts">
    interface Props {
        class?: string;
        children?: import('svelte').Snippet;
    }

    let { class: className = 'w-full', children }: Props = $props();

    
</script>

<div class="{className}">
    {@render children?.()}
</div>
