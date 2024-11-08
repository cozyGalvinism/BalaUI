<script lang="ts">
    import { run } from 'svelte/legacy';

    import { LabelField, TabbedHighlight, Button, LabelDropdown, Tag, CardDescription, ImageDrop, LabelCheckbox, LabelNumberInput, LabelTextArea } from "$lib/components"
    import atomOneDark from "svelte-highlight/styles/atom-one-dark";
    import { downloadZip } from "client-zip"
    import { localeList, type JokerData, type LocalizationEntry, type PreviewVariable, type Option, type CodeFile, toShareCode } from "$lib"
    import { goto } from "$app/navigation"
    import { _ } from 'svelte-i18n'
    import json from "svelte-highlight/languages/json"
    import lua from "svelte-highlight/languages/lua"

    interface Props {
        initialJokerData?: JokerData | null;
    }

    let { initialJokerData = null }: Props = $props();
    let code = '';

    function updateShareCode() {
        const jokerData: JokerData = {
            key: jokerKey,
            rarity: jokerRarity,
            discovered: jokerDiscovered,
            unlocked: jokerUnlocked,
            atlas: jokerAtlas,
            posX: jokerPosX,
            posY: jokerPosY,
            locName: jokerLocName,
            locText: jokerLocText,
            cost: jokerCost,
            blueprintCompat: jokerBlueprintCompat,
            eternalCompat: jokerEternalCompat,
            perishableCompat: jokerPerishableCompat,
            previewVariables: jokerPreviewVariables,
            localization: jokerLocalizationEntries,
        }
        const newCode = toShareCode(jokerData)

        if (newCode !== code) {
            code = newCode

            goto('?code=' + newCode, { replaceState: true, keepFocus: true, noScroll: true })
        }
    }

    const jokerRarities: Option<number>[] = [
        { value: 1, label: $_('balatro.rarities.common') },
        { value: 2, label: $_('balatro.rarities.uncommon') },
        { value: 3, label: $_('balatro.rarities.rare') },
        { value: 4, label: $_('balatro.rarities.legendary') },
    ]

    let jokerKey = $state(initialJokerData?.key || 'replace_me');
    let jokerRarity = $state(initialJokerData?.rarity || 1);
    let jokerDiscovered = $state(initialJokerData?.discovered || false);
    let jokerUnlocked = $state(initialJokerData?.unlocked || true);
    let jokerAtlas = $state(initialJokerData?.atlas || '');
    let jokerPosX = $state(initialJokerData?.posX || 0);
    let jokerPosY = $state(initialJokerData?.posY || 0);
    let jokerLocName = $state(initialJokerData?.locName || 'Placeholder Joker');
    let jokerLocText = $state(initialJokerData?.locText || '{C:mult}+4{} Mult');
    let jokerCost = $state(initialJokerData?.cost || 0);
    let jokerBlueprintCompat = $state(initialJokerData?.blueprintCompat || false);
    let jokerEternalCompat = $state(initialJokerData?.eternalCompat || true);
    let jokerPerishableCompat = $state(initialJokerData?.perishableCompat || true);

    let jokerPreviewVariables: PreviewVariable[] = $state(initialJokerData?.previewVariables || []);
    let jokerLocalizationEntries: LocalizationEntry[] = $state(initialJokerData?.localization || []);

    let activeTabValue: number = $state(0)

    let resolvedLocText = $derived.by(() => {
        let tmp = jokerLocText;
        jokerPreviewVariables.forEach((variable, index) => {
            tmp = tmp.replace(new RegExp(`#${index + 1}#`, 'g'), variable.value);
        });

        return tmp;
    });

    async function downloadModZip() {
        const splitText = jokerLocText.split('\n')
        const newText = splitText.map(line => `    '${line}'`).join(',\n                ')

        let localizationFiles = []

        for (let i = 0; i < jokerLocalizationEntries.length; i++) {
            const locEntry = jokerLocalizationEntries[i]
            localizationFiles.push({
                name: `MyMod/localization/${locEntry.locale}.json`,
                lastModified: new Date(),
                input: JSON.stringify({
                    descriptions: {
                        Joker: {
                            [`j_mymod_${jokerKey}`]: {
                                name: locEntry.name,
                                text: locEntry.text.split('\n')
                            }
                        }
                    }
                }, null, 2)
            })
        }

        const blob = await downloadZip([
            {
                name: 'MyMod/MyMod.lua',
                lastModified: new Date(),
                input: codePreview
            },
            {
                name: 'MyMod/localization/default.json',
                lastModified: new Date(),
                input: JSON.stringify({
                        descriptions: {
                            Joker: {
                                [`j_mymod_${jokerKey}`]: {
                                    name: jokerLocName,
                                    text: jokerLocText.split('\n')
                                }
                            }
                        }
                    }, null, 2)
            },
            ...localizationFiles
        ]).blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'MyMod.zip';
        link.click();
        link.remove();
    }

    let codePreview = $derived.by(() => {
        let code = `--- STEAMODDED HEADER
--- MOD_NAME: MyMod
--- MOD_ID: MyMod
--- MOD_AUTHOR: [Your Name]
--- MOD_DESCRIPTION: A mod
--- VERSION: 1.0.0
--- PREFIX: mymod
----------------------------------------------
------------MOD CODE -------------------------

SMODS.Joker{
    key = '${jokerKey}'`
        
        if (jokerRarity) {
            code += `,\n    rarity = ${jokerRarity}`
        }

        if (jokerDiscovered) {
            code += `,\n    discovered = true`
        }

        if (!jokerUnlocked) {
            code += `,\n    unlocked = false`
        }

        if (jokerAtlas) {
            code += `,\n    atlas = '${jokerAtlas}'`
        }

        if (jokerCost) {
            code += `,\n    cost = ${jokerCost}`
        }

        if (jokerBlueprintCompat) {
            code += `,\n    blueprint_compat = true`
        }

        if (!jokerEternalCompat) {
            code += `,\n    eternal_compat = false`
        }

        if (!jokerPerishableCompat) {
            code += `,\n    perishable_compat = false`
        }

        code += `,\n    pos = { x = ${jokerPosX}, y = ${jokerPosY} }`

        code += `,\n    config = { extra = {${jokerPreviewVariables.map((variable) => `${variable.name} = '${variable.value}'`).join(', ')}} }`

        code += `,\n    loc_vars = function(self, info_queue, card)
        return { vars = {${jokerPreviewVariables.map((variable) => `card.ability.extra.${variable.name}`).join(', ')}} }
    end`

        code += `,\n    calculate = function(self, card, context)\n    end`

        code = code.trimEnd().replace(/,\s*$/, '') + '\n}'

        code = code + `

----------------------------------------------
------------MOD CODE END----------------------`

        return code;
    });
    
    let previewFiles: CodeFile[] = $derived.by(() => {
        let files = [
            {
                fileName: 'MyMod/MyMod.lua',
                content: codePreview,
                lang: lua
            },
            {
                fileName: 'MyMod/localization/default.json',
                content: JSON.stringify({
                    descriptions: {
                        Joker: {
                            [`j_mymod_${jokerKey}`]: {
                                name: jokerLocName,
                                text: jokerLocText.split('\n')
                            }
                        }
                    }
                }, null, 2),
                lang: json
            },
            ...jokerLocalizationEntries.map(locEntry => {
                return {
                    fileName: `MyMod/localization/${locEntry.locale}.json`,
                    content: JSON.stringify({
                        descriptions: {
                            Joker: {
                                [`j_mymod_${jokerKey}`]: {
                                    name: locEntry.name,
                                    text: locEntry.text.split('\n')
                                }
                            }
                        }
                    }, null, 2),
                    lang: json
                }
            })
        ];

        return files;
    });

    function copyCode() {
        navigator.clipboard.writeText(codePreview)
    }

    function addVariable() {
        jokerPreviewVariables = [...jokerPreviewVariables, {name: '', value: ''}]
        updateShareCode()
    }

    function removeVariable(index: number) {
        jokerPreviewVariables = jokerPreviewVariables.filter((_, i) => i !== index)
        updateShareCode()
    }

    function addLocalizationEntry() {
        jokerLocalizationEntries = [...jokerLocalizationEntries, {name: '', text: '', locale: ''}]
        updateShareCode()
    }

    function removeLocalizationEntry(index: number) {
        jokerLocalizationEntries = jokerLocalizationEntries.filter((_, i) => i !== index)

        if (activeTabValue === index + 1) {
            activeTabValue = 0
        }

        updateShareCode()
    }
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="m6x11plus flex flex-row gap-2">
    <div class="text-2xl flex-1 flex flex-col gap-1">
        <LabelField name='jokerKey' label={$_('editor.key')} bind:value={jokerKey} onInput={updateShareCode} />
        <LabelField name='jokerLocName' label={$_('editor.name')} bind:value={jokerLocName} onInput={updateShareCode} />
        <LabelTextArea name='jokerLocText' label={$_('editor.description')} bind:value={jokerLocText} onInput={updateShareCode} />
        <LabelDropdown name='jokerRarity' label={$_('editor.joker.rarity')} onChange={updateShareCode} bind:value={jokerRarity} options={jokerRarities} />
        <LabelField name='jokerAtlas' label={$_('editor.atlas')} bind:value={jokerAtlas} onInput={updateShareCode} />
        <LabelNumberInput name='jokerCost' label={$_('editor.cost')} bind:value={jokerCost} onInput={updateShareCode} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name='jokerPosX' label={$_('editor.atlasX')} bind:value={jokerPosX} onInput={updateShareCode} />
            <LabelNumberInput name='jokerPosY' label={$_('editor.atlasY')} bind:value={jokerPosY} onInput={updateShareCode} />
        </div>
        <LabelCheckbox name='jokerDiscovered' label={$_('editor.discovered')} bind:value={jokerDiscovered} onChange={updateShareCode} />
        <LabelCheckbox name='jokerUnlocked' label={$_('editor.unlocked')} bind:value={jokerUnlocked} onChange={updateShareCode} />
        <LabelCheckbox name='jokerBlueprintCompat' label={$_('editor.joker.blueprintCompat')} bind:value={jokerBlueprintCompat} onChange={updateShareCode} />
        <LabelCheckbox name='jokerEternalCompat' label={$_('editor.joker.eternalCompat')} bind:value={jokerEternalCompat} onChange={updateShareCode} />
        <LabelCheckbox name='jokerPerishableCompat' label={$_('editor.joker.perishableCompat')} bind:value={jokerPerishableCompat} onChange={updateShareCode} />

        <p class="mt-2 text-3xl">{$_('editor.localization.title')}</p>

        <div class="flex flex-col gap-2">
            {#each jokerLocalizationEntries as entry, i}
                <div class="flex flex-col gap-2">
                    <LabelDropdown name="jokerLocalizationEntry_{i}_locale" label={$_('editor.localization.locale')} bind:value={entry.locale} options={localeList.map((loc) => { return { label: loc, value: loc }})} onChange={() => {
                        jokerLocalizationEntries = jokerLocalizationEntries
                        updateShareCode()
                    }} />
                    <LabelField name="jokerLocalizationEntry_{i}_name" label={$_('editor.name')} onInput={() => {
                        jokerLocalizationEntries = jokerLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.name} />
                    <LabelTextArea name="jokerLocalizationEntry_{i}_text" label={$_('editor.description')} onInput={() => {
                        jokerLocalizationEntries = jokerLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.text} />

                    <Button name="removeLocalizationEntry_{i}" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={() => removeLocalizationEntry(i)}>
                        {$_('editor.localization.remove')}
                    </Button>
                </div>
            {/each}

            <Button name="addLocalizationEntry" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={addLocalizationEntry}>
                {$_('editor.localization.add')}
            </Button>
        </div>

        <p class="mt-2 text-3xl">{$_('editor.variables.title')}</p>

        <div class="flex flex-col gap-2">
            {#each jokerPreviewVariables as variable, i}
                <div class="flex flex-row gap-4">
                    <LabelField name="jokerVariable_{i}_name" label={$_('editor.name')} onInput={() => {
                        jokerPreviewVariables = jokerPreviewVariables
                        updateShareCode()
                    }} bind:value={variable.name} />
                    <LabelField name="jokerVariable_{i}" label={$_('editor.value')} onInput={() => {
                        jokerPreviewVariables = jokerPreviewVariables
                        updateShareCode()
                    }} bind:value={variable.value}>
                        {#snippet afterInput()}
                        <Button class="text-base h-8 leading-4" name="removeVariable_{i}" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={() => removeVariable(i)}>
                            {$_('editor.variables.remove')}
                        </Button>
                        {/snippet}
                    </LabelField>
                </div>
            {/each}

            <Button name="addVariable" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={addVariable}>
                {$_('editor.variables.add')}
            </Button>
        </div>
    </div>
    <div class="flex-1 flex flex-col min-h-[50rem] gap-4">
        <div class="flex flex-col items-center gap-4">
            <ImageDrop />

            <CardDescription name={jokerLocName} description={resolvedLocText}>
                {#if jokerRarity == 1}
                    <Tag text={$_('balatro.rarities.common')} colour="#009dff" shadowColour="#007ecc" />
                {:else if jokerRarity == 2}
                    <Tag text={$_('balatro.rarities.uncommon')} colour="#4BC292" shadowColour="#3c9b75" />
                {:else if jokerRarity == 3}
                    <Tag text={$_('balatro.rarities.rare')} colour="#fe5f55" shadowColour="#cb4c44" />
                {:else if jokerRarity == 4}
                    <Tag text={$_('balatro.rarities.legendary')} colour="#b26cbb" shadowColour="#8e5696"  />
                {/if}
            </CardDescription>
        </div>

        <TabbedHighlight files={previewFiles} bind:activeTabValue={activeTabValue} />
        <Button name="downloadZip" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={downloadModZip}>{$_('editor.downloadMod')}</Button>
    </div>
</div>
