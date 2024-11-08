<script lang="ts">
    interface Props {
        text?: string;
        className?: string;
    }

    let { text = '', className = '' }: Props = $props();
</script>

<div class="{className}">
    {#each text.split('') as letter, index}
        <span class="jump" style="animation-delay: {index * 0.5}s"
            >{letter}</span>
    {/each}
</div>

<style lang="postcss">
    .jump {
        display: inline-block;
        animation: jump 3s infinite;
        text-shadow: 2px 2px 2px rgba(0, 0, 0, 1.0);
        box-shadow: none;
        white-space: pre;
    }

    @keyframes jump {
        0%,
        40%,
        100% {
            transform: translateY(0);
        }
        20% {
            transform: translateY(-2px);
        }
    }
</style>
