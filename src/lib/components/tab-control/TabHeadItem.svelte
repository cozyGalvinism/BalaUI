<script lang="ts">
    export let id: number
    export let buttonClass = ''
    export let liClass = 'mr-2'
</script>

<li class="{liClass}" role="presentation">
    <button class="{buttonClass}" on:click id="{id}-tabhead" type="button" role="tab">
        <slot />
    </button>
</li>
