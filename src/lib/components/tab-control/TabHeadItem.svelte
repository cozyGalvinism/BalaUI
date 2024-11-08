<script lang="ts">
    interface Props {
        id: number;
        buttonClass?: string;
        liClass?: string;
        children?: import('svelte').Snippet;

        onClick?: () => void;
    }

    let {
        id,
        buttonClass = '',
        liClass = 'mr-2',
        children,
        onClick
    }: Props = $props();
</script>

<li class="{liClass}" role="presentation">
    <button class="{buttonClass}" onclick={onClick} id="{id}-tabhead" type="button" role="tab">
        {@render children?.()}
    </button>
</li>
