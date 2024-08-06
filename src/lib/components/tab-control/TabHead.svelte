<script lang="ts">
    export let divClass = ''
    export let ulClass = 'flex flex-wrap -mb-px gap-2'
</script>

<div class="{divClass}">
    <ul class="{ulClass}" role="tablist">
        <slot />
    </ul>
    <slot name="after-tablist" />
</div>