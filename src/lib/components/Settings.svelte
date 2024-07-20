<script lang="ts">
    import { settings } from '$lib/stores'

    function toggleCrt() {
        $settings.crt = !$settings.crt
    }

    function toggleSmoothBackground() {
        $settings.smoothBackground = !$settings.smoothBackground
    }
</script>

<div>
    <ul class="m6x11plus flex flex-row gap-4 text-2xl">
        <li>
            <button name="crt" on:click={toggleCrt}>
                <span class="{$settings.crt ? 'text-green-500' : 'text-red-500'}">CRT</span>
            </button>
        </li>
        <li>
            <button name="smoothBackground" on:click={toggleSmoothBackground}>
                <span class="{$settings.smoothBackground ? 'text-green-500' : 'text-red-500'}">Smooth Background</span>
            </button>
        </li>
    </ul>
</div>
