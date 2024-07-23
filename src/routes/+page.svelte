<script lang="ts">
    import { version } from "$app/environment"
    import { _ } from 'svelte-i18n'

    type ChangelogEntry = {
        version: string
        date: string
        description?: string
        
        added?: string[]
        fixed?: string[]
        removed?: string[]
        changed?: string[]
    }

    let changelog: ChangelogEntry[] = [
        {
            version: '0.2.4',
            date: '2024-07-23',
            added: [
                $_('changelog.0_2_4.added_0'),
            ]
        },
        {
            version: '0.2.3',
            date: '2024-07-23',
            fixed: [
                $_('changelog.0_2_3.fixed_0'),
            ]
        },
        {
            version: '0.2.2',
            date: '2024-07-23',
            description: $_('changelog.0_2_2.description'),
            added: [
                $_('changelog.0_2_2.added_0'),
            ]
        },
        {
            version: '0.2.1',
            date: '2024-07-23',
            added: [
                $_('changelog.0_2_1.added_0'),
            ]
        },
        {
            version: '0.2.0',
            date: '2024-07-23',
            added: [
                $_('changelog.0_2_0.added_0'),
            ]
        },
        {
            version: '0.1.6',
            date: '2024-07-22',
            added: [
                $_('changelog.0_1_6.added_0')
            ]
        },
        {
            version: '0.1.5',
            date: '2024-07-22',
            changed: [
                $_('changelog.0_1_5.changed_0')
            ],
            fixed: [
                $_('changelog.0_1_5.fixed_0')
            ]
        },
        {
            version: '0.1.4',
            date: '2024-07-22',
            description: $_('changelog.0_1_4.description'),
            added: [
                $_('changelog.0_1_4.added_0'),
                $_('changelog.0_1_4.added_1')
            ],
            changed: [
                $_('changelog.0_1_4.changed_0'),
                $_('changelog.0_1_4.changed_1')
            ]
        },
        {
            version: '0.1.3',
            date: '2024-07-22',
            removed: [
                $_('changelog.0_1_3.removed_0')
            ],
            changed: [
                $_('changelog.0_1_3.changed_0')
            ]
        },
        {
            version: '0.1.2',
            date: '2024-07-22',
            fixed: [
                $_('changelog.0_1_2.fixed_0'),
            ],
            changed: [
                $_('changelog.0_1_2.changed_0'),
                $_('changelog.0_1_2.changed_1'),
            ]
        },
        {
            version: '0.1.1',
            date: '2024-07-21',
            fixed: [
                $_('changelog.0_1_1.fixed_0')
            ]
        },
        {
            version: '0.1.0',
            date: '2024-07-21',
            description: $_('changelog.0_1_0.description'),

            added: [
                $_('changelog.0_1_0.added_0'),
                $_('changelog.0_1_0.added_1')
            ]
        }
    ]

    function formatDate(date: string) {
        const d = new Date(date);
        return d.toLocaleDateString();
    }
</script>

<div class="m-2 mx-6 mb-0">
    <h1 class="text-5xl text-balatro-edition">{$_('page.index.title', {values: {version}})}</h1>

    <p class="py-2 text-2xl leading-[0.8]">
        {$_("page.index.description")}
    </p>

    <h2 class="text-4xl py-4">{$_('page.index.changelog.title')}</h2>

    {#each changelog as entry}
        <div class="pb-2">
            <h3 class="text-3xl">{entry.version} - {formatDate(entry.date)}</h3>
            
            {#if entry.description}
                <p class="text-xl">{entry.description}</p>
            {/if}

            {#if entry.added}
                <h4 class="text-2xl">{$_('page.index.changelog.added')}</h4>
                <ul class="changelog">
                    {#each entry.added as item}
                        <li class="text-xl">+ {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.fixed}
                <h4 class="text-2xl">{$_('page.index.changelog.fixed')}</h4>
                <ul class="changelog">
                    {#each entry.fixed as item}
                        <li class="text-xl">- {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.removed}
                <h4 class="text-2xl">{$_('page.index.changelog.removed')}</h4>
                <ul class="changelog">
                    {#each entry.removed as item}
                        <li class="text-xl">- {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.changed}
                <h4 class="text-2xl">{$_('page.index.changelog.changed')}</h4>
                <ul class="changelog">
                    {#each entry.changed as item}
                        <li class="text-xl">* {item}</li>
                    {/each}
                </ul>
            {/if}

            <hr class="mt-4">
        </div>
    {/each}
</div>

<style lang="postcss">
    .changelog {
        list-style: none;
        margin-left: 0;
        padding-left: 1em;
        text-indent: -1em;
    }

    .changelog > li {
        padding-left: 1rem;
    }
</style>
