<script lang="ts">
    let className: string = 'w-full'

    export { className as class }
</script>

<div class="{className}">
    <slot />
</div>
