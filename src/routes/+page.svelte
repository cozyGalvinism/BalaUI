<script lang="ts">
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
            version: '0.1.6',
            date: '2024-07-22',
            added: [
                'Made the joker creation shareable using a parameter in the URL'
            ]
        },
        {
            version: '0.1.5',
            date: '2024-07-22',
            changed: [
                'Turned the text box for the locale into a dropdown'
            ],
            fixed: [
                'Fixed absurdly large clickable area of checkboxes'
            ]
        },
        {
            version: '0.1.4',
            date: '2024-07-22',
            description: 'There\'s now a download button for the created joker, which will download the joker and the localization files as a zip file. Please make sure to change the PREFIX to your mod\'s prefix and adjust the localization files as such. Eventually, this will get a modal for entering the desired values.',
            added: [
                'Added improved localization support',
                'Added a download button to download the created Joker as a mod (this still requires some changes to the mod itself to remove placeholder values)'
            ],
            changed: [
                "Changed variables to have names",
                "Variables are now added to the config key and returned in the loc_vars function"
            ]
        },
        {
            version: '0.1.3',
            date: '2024-07-22',
            removed: [
                'Removed Name field from Joker creator'
            ],
            changed: [
                'Changed "Localized Name" and "Localized Text" to "Name" and "Description" in the Joker creator'
            ]
        },
        {
            version: '0.1.2',
            date: '2024-07-22',
            fixed: [
                'Fixed underline not applying to nav links',
            ],
            changed: [
                'Changed eternal_compat and perishable_compat to true by default',
                'Changed changelog to display the dates using the browser\'s locale',
            ]
        },
        {
            version: '0.1.1',
            date: '2024-07-21',
            fixed: [
                'Fixed incorrect pathing on the website'
            ]
        },
        {
            version: '0.1.0',
            date: '2024-07-21',
            description: 'This is the initial release of BalaUI. Expect some bugs and missing features.',

            added: [
                'Added Joker creator',
                'Added settings'
            ]
        }
    ]

    function formatDate(date: string) {
        const d = new Date(date);
        return d.toLocaleDateString();
    }
</script>

<div class="m-2 mx-6 mb-0">
    <h1 class="text-5xl">BalaUI</h1>

    <p class="py-2 text-2xl leading-[0.8]">
        A set of modding utilities for <a href="https://store.steampowered.com/app/2379780/Balatro/">Balatro</a> 
        and <a href="https://github.com/Steamopollys/Steamodded/">Steamodded</a>.
    </p>

    <h2 class="text-4xl py-4">Changelog</h2>

    {#each changelog as entry}
        <div class="pb-2">
            <h3 class="text-3xl">{entry.version} - {formatDate(entry.date)}</h3>
            
            {#if entry.description}
                <p class="text-xl">{entry.description}</p>
            {/if}

            {#if entry.added}
                <h4 class="text-2xl">Added</h4>
                <ul class="changelog">
                    {#each entry.added as item}
                        <li class="text-xl">+ {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.fixed}
                <h4 class="text-2xl">Fixed</h4>
                <ul class="changelog">
                    {#each entry.fixed as item}
                        <li class="text-xl">- {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.removed}
                <h4 class="text-2xl">Removed</h4>
                <ul class="changelog">
                    {#each entry.removed as item}
                        <li class="text-xl">- {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.changed}
                <h4 class="text-2xl">Changed</h4>
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
