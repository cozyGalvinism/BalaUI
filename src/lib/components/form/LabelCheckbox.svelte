<script lang="ts">
    interface Props {
        name: string;
        label: string;
        value: boolean;

        onChange?: () => void;
    }

    let { name, label, value = $bindable(), onChange }: Props = $props();

    function flip() {
        value = !value
    }
</script>

<div class="inline-flex flex-row gap-2">
    <input id="{name}" class="w-6" type="checkbox" name="{name}" bind:checked={value} onchange={onChange}>
    <label for="{name}">{label}</label>
</div>
