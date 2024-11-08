<script lang="ts">
    interface Props {
        name: string;
        label: string;
        value: string;

        onInput?: () => void;
    }

    let { name, label, value = $bindable(), onInput }: Props = $props();
</script>

<div class="flex flex-col">
    <label for="{name}">{label}</label>
    <textarea
        id="{name}"
        name="{name}"
        bind:value={value}
        class="text-black pl-2 rounded-lg min-h-[100px] shadow-[0_3px_0_0_#cccccc]"
        oninput={onInput}
></textarea>
</div>