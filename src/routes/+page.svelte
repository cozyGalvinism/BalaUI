<script lang="ts">
    import { version } from "$app/environment"
    import Changelog from "$lib/components/Changelog.svelte"
    import { _ } from 'svelte-i18n'
</script>

<div class="m-2 mx-6 mb-0">
    <h1 class="text-5xl text-balatro-edition">{$_('page.index.title', {values: {version}})}</h1>

    <p class="py-2 text-2xl leading-[0.8]">
        {$_("page.index.description")}
    </p>

    <h2 class="text-4xl py-4">{$_('page.index.changelog.title')}</h2>
    <Changelog />
</div>
