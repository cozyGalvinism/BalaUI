<script lang="ts">
    import { version } from '$app/environment'
    import { _, date } from 'svelte-i18n'

    type ChangelogEntry = {
        version: string
        date: string
        description?: string

        added?: string[]
        fixed?: string[]
        removed?: string[]
        changed?: string[]
    }

    const dateFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }

    let changelog: ChangelogEntry[] = [
        {
            version: '0.4.0',
            date: $date(new Date('2024-08-06'), dateFormat),
            added: [$_('changelog.0_4_0.added_0')],
            changed: [$_('changelog.0_4_0.changed_0')],
        },
        {
            version: '0.3.0',
            date: $date(new Date('2024-07-24'), dateFormat),
            added: [$_('changelog.0_3_0.added_0')],
            fixed: [
                $_('changelog.0_3_0.fixed_0'),
                $_('changelog.0_3_0.fixed_1'),
                $_('changelog.0_3_0.fixed_2'),
            ],
        },
        {
            version: '0.2.6',
            date: $date(new Date('2024-07-24'), dateFormat),
            changed: [$_('changelog.0_2_6.changed_0')],
        },
        {
            version: '0.2.5',
            date: $date(new Date('2024-07-24'), dateFormat),
            added: [$_('changelog.0_2_5.added_0')],
            changed: [$_('changelog.0_2_5.changed_0')],
        },
        {
            version: '0.2.4',
            date: $date(new Date('2024-07-23'), dateFormat),
            added: [$_('changelog.0_2_4.added_0')],
        },
        {
            version: '0.2.3',
            date: $date(new Date('2024-07-23'), dateFormat),
            fixed: [$_('changelog.0_2_3.fixed_0')],
        },
        {
            version: '0.2.2',
            date: $date(new Date('2024-07-23'), dateFormat),
            description: $_('changelog.0_2_2.description'),
            added: [$_('changelog.0_2_2.added_0')],
        },
        {
            version: '0.2.1',
            date: $date(new Date('2024-07-23'), dateFormat),
            added: [$_('changelog.0_2_1.added_0')],
        },
        {
            version: '0.2.0',
            date: $date(new Date('2024-07-23'), dateFormat),
            added: [$_('changelog.0_2_0.added_0')],
        },
        {
            version: '0.1.6',
            date: $date(new Date('2024-07-22'), dateFormat),
            added: [$_('changelog.0_1_6.added_0')],
        },
        {
            version: '0.1.5',
            date: $date(new Date('2024-07-22'), dateFormat),
            changed: [$_('changelog.0_1_5.changed_0')],
            fixed: [$_('changelog.0_1_5.fixed_0')],
        },
        {
            version: '0.1.4',
            date: $date(new Date('2024-07-22'), dateFormat),
            description: $_('changelog.0_1_4.description'),
            added: [
                $_('changelog.0_1_4.added_0'),
                $_('changelog.0_1_4.added_1'),
            ],
            changed: [
                $_('changelog.0_1_4.changed_0'),
                $_('changelog.0_1_4.changed_1'),
            ],
        },
        {
            version: '0.1.3',
            date: $date(new Date('2024-07-22'), dateFormat),
            removed: [$_('changelog.0_1_3.removed_0')],
            changed: [$_('changelog.0_1_3.changed_0')],
        },
        {
            version: '0.1.2',
            date: $date(new Date('2024-07-22'), dateFormat),
            fixed: [$_('changelog.0_1_2.fixed_0')],
            changed: [
                $_('changelog.0_1_2.changed_0'),
                $_('changelog.0_1_2.changed_1'),
            ],
        },
        {
            version: '0.1.1',
            date: $date(new Date('2024-07-21'), dateFormat),
            fixed: [$_('changelog.0_1_1.fixed_0')],
        },
        {
            version: '0.1.0',
            date: $date(new Date('2024-07-21'), dateFormat),
            description: $_('changelog.0_1_0.description'),

            added: [
                $_('changelog.0_1_0.added_0'),
                $_('changelog.0_1_0.added_1'),
            ],
        },
    ]

    function formatDate(date: string) {
        const d = new Date(date)
        return d.toLocaleDateString()
    }
</script>

{#each changelog as entry}
    <div class="pb-2">
        <h3 class="text-3xl">{entry.version} - {entry.date}</h3>

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

        <hr class="mt-4" />
    </div>
{/each}

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
