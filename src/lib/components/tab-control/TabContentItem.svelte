<script lang="ts">
    export let activeTabValue: number
    export let id: number
    
    let className: string = 'p-4 bg-gray-50 rounded-lg'
    export { className as class }
</script>

{#if activeTabValue === id}
    <div class="{className}">
        <slot />
    </div>
{/if}
