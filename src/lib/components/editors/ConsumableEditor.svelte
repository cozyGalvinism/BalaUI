<script lang="ts">
    import { goto } from "$app/navigation"
    import { localeList, toShareCode, type CodeFile, type ConsumableData, type Option } from "$lib"
    import atomOneDark from "svelte-highlight/styles/atom-one-dark"
    import { LabelField, TabbedHighlight, Button, LabelDropdown, Tag, CardDescription, ImageDrop, LabelCheckbox, LabelNumberInput, LabelTextArea } from "$lib/components"
    import lua from "svelte-highlight/languages/lua"
    import json from "svelte-highlight/languages/json"
    import { downloadZip } from "client-zip"
    import { _ } from 'svelte-i18n'

    export let initialConsumableData: ConsumableData | null = null;

    let consumableKey = initialConsumableData?.key ?? 'replace_me'
    let consumableSet = initialConsumableData?.set ?? 'Tarot'
    let consumableLocName = initialConsumableData?.locName ?? 'The Hermit'
    let consumableLocText = initialConsumableData?.locText ?? 'Doubles money\n{C:inactive}(Max of {C:money}$20{C:inactive})'
    let consumableCost = initialConsumableData?.cost ?? 0
    let consumablePosX = initialConsumableData?.posX ?? 0
    let consumablePosY = initialConsumableData?.posY ?? 0
    let consumableAtlas = initialConsumableData?.atlas ?? ''
    let consumableUnlocked = initialConsumableData?.unlocked ?? true
    let consumableDiscovered = initialConsumableData?.discovered ?? false
    let consumableHidden = initialConsumableData?.hidden ?? false
    let consumableSoulSet = initialConsumableData?.soulSet ?? 'Spectral'
    let consumableSoulRate = initialConsumableData?.soulRate ?? 0.003
    let consumableCanRepeatSoul = initialConsumableData?.canRepeatSoul ?? false
    let consumablePreviewVariables = initialConsumableData?.previewVariables ?? []
    let consumableLocalizationEntries = initialConsumableData?.localization ?? []

    let code = ''

    function updateShareCode() {
        const newCode = toShareCode({
            key: consumableKey,
            set: consumableSet,
            locName: consumableLocName,
            locText: consumableLocText,
            cost: consumableCost,
            posX: consumablePosX,
            posY: consumablePosY,
            atlas: consumableAtlas,
            unlocked: consumableUnlocked,
            discovered: consumableDiscovered,
            hidden: consumableHidden,
            soulSet: consumableSoulSet,
            soulRate: consumableSoulRate,
            canRepeatSoul: consumableCanRepeatSoul,
            previewVariables: consumablePreviewVariables,
            localization: consumableLocalizationEntries,
        })

        if (newCode !== code) {
            code = newCode

            goto('?code=' + newCode, { replaceState: true, keepFocus: true, noScroll: true })
        }
    }

    const consumableSets: Option<string>[] = [
        {
            label: $_('balatro.cardTypes.tarot'),
            value: 'Tarot'
        },
        {
            label: $_('balatro.cardTypes.planet'),
            value: 'Planet'
        },
        {
            label: $_('balatro.cardTypes.spectral'),
            value: 'Spectral'
        }
    ]

    let activeTabValue: number

    let resolvedLocText = '';
    $: {
        resolvedLocText = consumableLocText;

        consumablePreviewVariables.forEach((variable, index) => {
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

SMODS.Consumable{
    key = '${consumableKey}'`

        codePreview += `,\n    set = '${consumableSet}'`

        if (consumableDiscovered) {
            codePreview += `,\n    discovered = true`
        }

        if (!consumableUnlocked) {
            codePreview += `,\n    unlocked = false`
        }

        if (consumableAtlas) {
            codePreview += `,\n    atlas = '${consumableAtlas}'`
        }

        if (consumableCost) {
            codePreview += `,\n    cost = ${consumableCost}`
        }

        if (consumableHidden) {
            codePreview += `,\n    hidden = true`
            
            if (consumableSoulSet) {
                codePreview += `,\n    soul_set = '${consumableSoulSet}'`
            }

            if (consumableSoulRate) {
                codePreview += `,\n    soul_rate = ${consumableSoulRate}`
            }

            if (consumableCanRepeatSoul) {
                codePreview += `,\n    can_repeat_soul = true`
            }
        }

        codePreview += `,\n    pos = { x = ${consumablePosX}, y = ${consumablePosY} }`

        codePreview += `,\n    config = { extra = {${consumablePreviewVariables.map((variable) => `${variable.name} = '${variable.value}'`).join(', ')}} }`

        codePreview += `,\n    loc_vars = function(self, info_queue, card)
        return { vars = {${consumablePreviewVariables.map((variable) => `card.ability.extra.${variable.name}`).join(', ')}} }
    end`

        codePreview += `,\n    use = function(self, card, area, copier)\n    end`

        codePreview += `,\n    can_use = function(self, card)\n        return true\n    end`

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
                        [consumableSet]: {
                            [`c_mymod_${consumableKey}`]: {
                                name: consumableLocName,
                                text: consumableLocText.split('\n')
                            }
                        }
                    }
                }, null, 2),
                lang: json
            },
            ...consumableLocalizationEntries.map(locEntry => {
                return {
                    fileName: `MyMod/localization/${locEntry.locale}.json`,
                    content: JSON.stringify({
                        descriptions: {
                            [consumableSet]: {
                                [`c_mymod_${consumableKey}`]: {
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
        consumablePreviewVariables = [...consumablePreviewVariables, {name: '', value: ''}]
        updateShareCode()
    }

    function removeVariable(index: number) {
        consumablePreviewVariables = consumablePreviewVariables.filter((_, i) => i !== index)
        updateShareCode()
    }

    function addLocalizationEntry() {
        consumableLocalizationEntries = [...consumableLocalizationEntries, {name: '', text: '', locale: ''}]
        updateShareCode()
    }

    function removeLocalizationEntry(index: number) {
        consumableLocalizationEntries = consumableLocalizationEntries.filter((_, i) => i !== index)
        updateShareCode()
    }

    async function downloadModZip() {
        let localizationFiles = []

        for (let i = 0; i < consumableLocalizationEntries.length; i++) {
            const locEntry = consumableLocalizationEntries[i]
            localizationFiles.push({
                name: `MyMod/localization/${locEntry.locale}.json`,
                lastModified: new Date(),
                input: JSON.stringify({
                    descriptions: {
                        [consumableSet]: {
                            [`c_mymod_${consumableKey}`]: {
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
                        [consumableSet]: {
                            [`c_mymod_${consumableKey}`]: {
                                name: consumableLocName,
                                text: consumableLocText.split('\n')
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

    function copyCode() {
        navigator.clipboard.writeText(codePreview)
    }
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="flex flex-row gap-2">
    <div class="text-2xl flex-1 flex flex-col gap-1">
        <LabelField name="consumableKey" label="{$_('editor.key')}" bind:value={consumableKey} on:input={updateShareCode} />
        <LabelField name="consumableName" label="{$_('editor.name')}" bind:value={consumableLocName} on:input={updateShareCode} />
        <LabelTextArea name="consumableLocText" label='{$_('editor.description')}' bind:value={consumableLocText} on:input={updateShareCode} />
        <LabelDropdown name="consumableSet" label="{$_('editor.consumable.set')}" bind:value={consumableSet} on:change={updateShareCode} options={consumableSets} />
        <LabelField name="consumableAtlas" label="{$_('editor.atlas')}" bind:value={consumableAtlas} on:input={updateShareCode} />
        <LabelNumberInput name="consumableCost" label="{$_('editor.cost')}" bind:value={consumableCost} on:input={updateShareCode} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name="consumablePosX" label="{$_('editor.atlasX')}" bind:value={consumablePosX} on:input={updateShareCode} />
            <LabelNumberInput name="consumablePosY" label="{$_('editor.atlasY')}" bind:value={consumablePosY} on:input={updateShareCode} />
        </div>
        <LabelCheckbox name='consumableDiscovered' label='{$_('editor.discovered')}' bind:value={consumableDiscovered} on:change={updateShareCode} />
        <LabelCheckbox name='consumableUnlocked' label='{$_('editor.unlocked')}' bind:value={consumableUnlocked} on:change={updateShareCode} />
        <LabelCheckbox name='consumableHidden' label='{$_('editor.consumable.hidden')}' bind:value={consumableHidden} on:change={updateShareCode} />

        {#if consumableHidden}
            <p class="mt-2 text-3xl">{$_('editor.consumable.hiddenSettingsTitle')}</p>
            <LabelDropdown name="consumableSoulSet" label="{$_('editor.consumable.soulSet')}" bind:value={consumableSoulSet} on:input={updateShareCode} options={consumableSets} />
            <LabelNumberInput name="consumableSoulRate" label="{$_('editor.consumable.soulRate')}" max={1.0} step={0.001} bind:value={consumableSoulRate} on:input={updateShareCode} />
            <LabelCheckbox name="consumableCanRepeatSoul" label="{$_('editor.consumable.canRepeat')}" bind:value={consumableCanRepeatSoul} on:change={updateShareCode} />
        {/if}

        <p class="mt-2 text-3xl">{$_('editor.localization.title')}</p>

        <div class="flex flex-col gap-2">
            {#each consumableLocalizationEntries as entry, i}
                <div class="flex flex-col gap-2">
                    <LabelDropdown name="consumableLocalizationEntry_{i}_locale" label="{$_('editor.localization.locale')}" bind:value={entry.locale} options={localeList.map((loc) => { return { label: loc, value: loc }})} on:change={() => {
                        consumableLocalizationEntries = consumableLocalizationEntries
                        updateShareCode()
                    }} />
                    <LabelField name="consumableLocalizationEntry_{i}_name" label="{$_('editor.name')}" on:input={() => {
                        consumableLocalizationEntries = consumableLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.name} />
                    <LabelTextArea name="consumableLocalizationEntry_{i}_text" label="{$_('editor.description')}" on:input={() => {
                        consumableLocalizationEntries = consumableLocalizationEntries
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
            {#each consumablePreviewVariables as variable, i}
                <div class="flex flex-row gap-4">
                    <LabelField name="consumableVariable_{i}_name" label="{$_('editor.name')}" on:input={() => {
                        consumablePreviewVariables = consumablePreviewVariables
                        updateShareCode()
                    }} bind:value={variable.name} />
                    <LabelField name="consumableVariable_{i}" label="{$_('editor.value')}" on:input={() => {
                        consumablePreviewVariables = consumablePreviewVariables
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

            <CardDescription name={consumableLocName} description={resolvedLocText}>
                {#if consumableSet === 'Tarot'}
                    <Tag text="{$_('balatro.cardTypes.tarot')}" colour="#a782d1" shadowColour="#8668a7" />
                {:else if consumableSet === 'Planet'}
                    <Tag text="{$_('balatro.cardTypes.planet')}" colour="#13afce" shadowColour="#0f8ca5" />
                {:else if consumableSet === 'Spectral'}
                    <Tag text="{$_('balatro.cardTypes.spectral')}" colour="#4584fa" shadowColour="#376ac8" />
                {/if}
            </CardDescription>
        </div>

        <TabbedHighlight files={previewFiles} bind:activeTabValue={activeTabValue} />
        <Button name="downloadZip" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={downloadModZip}>{$_('editor.downloadMod')}</Button>
    </div>
</div>
