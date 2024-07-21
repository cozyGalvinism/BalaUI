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
            version: '0.1.0',
            date: '2024-07-21',
            description: 'This is the initial release of BalaUI. Expect some bugs and missing features.',

            added: [
                'Added Joker creator',
                'Added settings'
            ]
        }
    ]
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
            <h3 class="text-3xl">{entry.version} - {entry.date}</h3>
            
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
                        <li>- {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.removed}
                <h4 class="text-2xl">Removed</h4>
                <ul class="changelog">
                    {#each entry.removed as item}
                        <li>- {item}</li>
                    {/each}
                </ul>
            {/if}

            {#if entry.changed}
                <h4 class="text-2xl">Changed</h4>
                <ul class="changelog">
                    {#each entry.changed as item}
                        <li>* {item}</li>
                    {/each}
                </ul>
            {/if}

            <hr />
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
