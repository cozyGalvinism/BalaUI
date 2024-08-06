<script lang="ts">
    import { localeList, toShareCode, type CodeFile, type DeckData } from "$lib"
    import { LabelField, TabbedHighlight, Button, LabelDropdown, Tag, CardDescription, ImageDrop, LabelCheckbox, LabelNumberInput, LabelTextArea } from "$lib/components"
    import lua from "svelte-highlight/languages/lua"
    import json from "svelte-highlight/languages/json"
    import { downloadZip } from "client-zip"
    import atomOneDark from "svelte-highlight/styles/atom-one-dark"
    import { _ } from 'svelte-i18n'
    import { goto } from "$app/navigation"

    export let initialDeckData: DeckData | null = null;
    let code = '';

    let deckKey = initialDeckData?.key ?? 'replace_me'
    let deckLocName = initialDeckData?.locName ?? 'Red Deck'
    let deckLocText = initialDeckData?.locText ?? '{C:mult}+1{} discard\nevery round'
    let deckPosX = initialDeckData?.posX ?? 0
    let deckPosY = initialDeckData?.posY ?? 0
    let deckAtlas = initialDeckData?.atlas ?? ''
    let deckUnlocked = initialDeckData?.unlocked ?? true
    let deckDiscovered = initialDeckData?.discovered ?? false
    let deckPreviewVariables = initialDeckData?.previewVariables ?? []
    let deckLocalizationEntries = initialDeckData?.localization ?? []

    let activeTabValue: number

    let resolvedLocText = '';
    $: {
        resolvedLocText = deckLocText;

        deckPreviewVariables.forEach((variable, index) => {
            resolvedLocText = resolvedLocText.replace(new RegExp(`#${index + 1}#`, 'g'), variable.value);
        });
    }

    let codePreview = ''
    let previewFiles: CodeFile[] = []
    $: {
        codePreview = `--- STEAMODDED HEADER
--- MOD_NAME: MyMod
--- MOD_ID: MyMod
--- MOD_AUTHOR: [Your Name]
--- MOD_DESCRIPTION: A mod
--- VERSION: 1.0.0
--- PREFIX: mymod
----------------------------------------------
------------MOD CODE -------------------------

SMODS.Back{
    key = '${deckKey}'`

        if (deckDiscovered) {
            codePreview += `,\n    discovered = true`
        }

        if (!deckUnlocked) {
            codePreview += `,\n    unlocked = false`
        }

        if (deckAtlas) {
            codePreview += `,\n    atlas = '${deckAtlas}'`
        }

        codePreview += `,\n    pos = {x = ${deckPosX}, y = ${deckPosY}}`

        codePreview += `,\n    config = { extra = {${deckPreviewVariables.map((variable) => `${variable.name} = '${variable.value}'`).join(', ')}} }`

        codePreview += `,\n    loc_vars = function(self, info_queue, center)
        return { vars = {${deckPreviewVariables.map((variable) => `center.config.extra.${variable.name}`).join(', ')}} }
    end`
        
        codePreview += `,\n    apply = function(self)
    end`
        
        codePreview += `,\n    trigger_effect = function(self, args)
    end`

        codePreview = codePreview.trimEnd().replace(/,\s*$/, '') + '\n}'

        codePreview = codePreview + `

----------------------------------------------
------------MOD CODE END----------------------`

        previewFiles = [
            {
                fileName: 'MyMod/MyMod.lua',
                content: codePreview,
                lang: lua
            },
            {
                fileName: 'MyMod/localization/default.json',
                content: JSON.stringify({
                    descriptions: {
                        Back: {
                            [`b_mymod_${deckKey}`]: {
                                name: deckLocName,
                                text: deckLocText.split('\n')
                            }
                        }
                    }
                }, null, 2),
                lang: json
            },
            ...deckLocalizationEntries.map(locEntry => {
                return {
                    fileName: `MyMod/localization/${locEntry.locale}.json`,
                    content: JSON.stringify({
                        descriptions: {
                            Back: {
                                [`b_mymod_${deckKey}`]: {
                                    name: locEntry.name,
                                    text: locEntry.text.split('\n')
                                }
                            }
                        }
                    }, null, 2),
                    lang: json
                }
            })
        ]
    }

    function addVariable() {
        deckPreviewVariables = [...deckPreviewVariables, { name: '', value: '' }];
        updateShareCode()
    }

    function removeVariable(index: number) {
        deckPreviewVariables = deckPreviewVariables.filter((_, i) => i !== index);
        updateShareCode()
    }

    function addLocalizationEntry() {
        deckLocalizationEntries = [...deckLocalizationEntries, { name: '', text: '', locale: '' }];
        updateShareCode()
    }

    function removeLocalizationEntry(index: number) {
        deckLocalizationEntries = deckLocalizationEntries.filter((_, i) => i !== index);
        updateShareCode()
    }

    async function downloadModZip() {
        let localizationFiles = []

        for (let i = 0; i < deckLocalizationEntries.length; i++) {
            const locEntry = deckLocalizationEntries[i]

            localizationFiles.push({
                name: `MyMod/localization/${locEntry.locale}.json`,
                input: JSON.stringify({
                    descriptions: {
                        Back: {
                            [`b_mymod_${deckKey}`]: {
                                name: locEntry.name,
                                text: locEntry.text.split('\n')
                            }
                        }
                    }
                }, null, 2),
                lastModified: new Date(),
            })
        }

        const blob = await downloadZip([
            {
                name: 'MyMod/MyMod.lua',
                lastModified: new Date(),
                input: codePreview,
            },
            {
                name: 'MyMod/localization/default.json',
                lastModified: new Date(),
                input: JSON.stringify({
                    descriptions: {
                        Back: {
                            [`b_mymod_${deckKey}`]: {
                                name: deckLocName,
                                text: deckLocText.split('\n')
                            }
                        }
                    }
                }, null, 2),
            },
            ...localizationFiles
        ]).blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'MyMod.zip';
        link.click();
        link.remove();
    }

    function updateShareCode() {
        const newCode = toShareCode({
            key: deckKey,
            locName: deckLocName,
            locText: deckLocText,
            atlas: deckAtlas,
            posX: deckPosX,
            posY: deckPosY,
            previewVariables: deckPreviewVariables,
            localizationEntries: deckLocalizationEntries,
            unlocked: deckUnlocked,
            discovered: deckDiscovered
        })

        if (newCode !== code) {
            code = newCode

            goto('?code=' + code, { replaceState: true, keepFocus: true, noScroll: true })
        }
    }
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="flex flex-row gap-2">
    <div class="text-2xl flex-1 flex flex-col gap-1">
        <LabelField name="deckKey" label="{$_('editor.key')}" bind:value={deckKey} on:input={updateShareCode} />
        <LabelField name="deckLocName" label="{$_('editor.name')}" bind:value={deckLocName} on:input={updateShareCode} />
        <LabelTextArea name="deckLocText" label="{$_('editor.description')}" bind:value={deckLocText} on:input={updateShareCode} />
        <LabelField name="deckAtlas" label="{$_('editor.atlas')}" bind:value={deckAtlas} on:input={updateShareCode} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name="deckPosX" label="{$_('editor.atlasX')}" bind:value={deckPosX} on:input={updateShareCode} />
            <LabelNumberInput name="deckPosY" label="{$_('editor.atlasY')}" bind:value={deckPosY} on:input={updateShareCode} />
        </div>

        <LabelCheckbox name="deckUnlocked" label="{$_('editor.unlocked')}" bind:value={deckUnlocked} on:change={updateShareCode} />
        <LabelCheckbox name="deckDiscovered" label="{$_('editor.discovered')}" bind:value={deckDiscovered} on:change={updateShareCode} />

        <p class="mt-2 text-3xl">{$_('editor.localization.title')}</p>
        <div class="flex flex-col gap-2">
            {#each deckLocalizationEntries as entry, i}
                <div class="flex flex-col gap-2">
                    <LabelDropdown name="deckLocalizationEntry_{i}_locale" label="{$_('editor.localization.locale')}" bind:value={entry.locale} options={localeList.map((loc) => { return { label: loc, value: loc }})} on:change={() => {
                        deckLocalizationEntries = deckLocalizationEntries
                        updateShareCode()
                    }} />
                    <LabelField name="deckLocalizationEntry_{i}_name" label="{$_('editor.name')}" on:input={() => {
                        deckLocalizationEntries = deckLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.name} />
                    <LabelTextArea name="deckLocalizationEntry_{i}_text" label="{$_('editor.description')}" on:input={() => {
                        deckLocalizationEntries = deckLocalizationEntries
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
            {#each deckPreviewVariables as variable, i}
                <div class="flex flex-row gap-4">
                    <LabelField name="consumableVariable_{i}_name" label="{$_('editor.name')}" on:input={() => {
                        deckPreviewVariables = deckPreviewVariables
                        updateShareCode()
                    }} bind:value={variable.name} />
                    <LabelField name="consumableVariable_{i}" label="{$_('editor.value')}" on:input={() => {
                        deckPreviewVariables = deckPreviewVariables
                        updateShareCode()
                    }} bind:value={variable.value}>
                        <Button slot="after-input" class="text-base h-8 leading-4" name="removeVariable_{i}" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={() => removeVariable(i)}>
                            {$_('editor.variables.remove')}
                        </Button>
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

            <CardDescription name={deckLocName} description={resolvedLocText}>
                
            </CardDescription>
        </div>

        <TabbedHighlight files={previewFiles} bind:activeTabValue={activeTabValue} />
        <Button name="downloadZip" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={downloadModZip}>{$_('editor.downloadMod')}</Button>
    </div>
</div>
