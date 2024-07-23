<script lang="ts">
    import { goto } from "$app/navigation"
    import { localeList, type ConsumableData, type Option } from "$lib"
    import atomOneDark from "svelte-highlight/styles/atom-one-dark"
    import LabelField from "./LabelField.svelte"
    import LabelDropdown from "./LabelDropdown.svelte"
    import ImageDrop from "./ImageDrop.svelte"
    import CardDescription from "./CardDescription.svelte"
    import Highlight, { LineNumbers } from "svelte-highlight"
    import lua from "svelte-highlight/languages/lua"
    import Button from "./Button.svelte"
    import { downloadZip } from "client-zip"
    import Tag from "./Tag.svelte"
    import LabelTextArea from "./LabelTextArea.svelte"
    import LabelNumberInput from "./LabelNumberInput.svelte"
    import LabelCheckbox from "./LabelCheckbox.svelte"

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
        const newCode = btoa(JSON.stringify({
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
        } as ConsumableData))

        if (newCode !== code) {
            code = newCode

            goto('?code=' + newCode, { replaceState: true, keepFocus: true, noScroll: true })
        }
    }

    const consumableSets = [
        'Tarot',
        'Planet',
        'Spectral'
    ]

    let resolvedLocText = '';
    $: {
        resolvedLocText = consumableLocText;

        consumablePreviewVariables.forEach((variable, index) => {
            resolvedLocText = resolvedLocText.replace(`#${index + 1}#`, variable.value);
        });
    }

    let codePreview = ''
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

        codePreview += `,\n    config = { extra = {${consumablePreviewVariables.map((variable) => `${variable.name} = '${variable.value}'`)}} }`

        codePreview += `,\n    loc_vars = function(self, info_queue, card)
        return { vars = {${consumablePreviewVariables.map((variable) => `card.ability.extra.${variable.name}`).join(', ')}} }
    end`

        codePreview += `,\n    use = function(self, card, area, copier)\n    end`

        codePreview += `,\n    can_use = function(self, card)\n        return true\n    end`

        codePreview = codePreview.trimEnd().replace(/,\s*$/, '') + '\n}'

        codePreview = codePreview + `

----------------------------------------------
------------MOD CODE END----------------------`
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
        const splitText = consumableLocText.split('\n')
        const newText = splitText.map(line => `    '${line}'`).join(',\n                ')

        let localizationFiles = []

        for (let i = 0; i < consumableLocalizationEntries.length; i++) {
            const locEntry = consumableLocalizationEntries[i]
            const splitText = locEntry.text.split('\n')
            const newText = splitText.map(line => `    '${line}'`).join(',\n                ')
            localizationFiles.push({
                name: `MyMod/localization/${locEntry.locale}.lua`,
                lastModified: new Date(),
                input: `return {
    descriptions = {
        ${consumableSet} = {
            c_mymod_${consumableKey} = {
                name = "${locEntry.name}",
                text = {
                ${newText}
                }
            }
        }
    }
}`
            })
        }

        const blob = await downloadZip([
            {
                name: 'MyMod/MyMod.lua',
                lastModified: new Date(),
                input: codePreview
            },
            {
                name: 'MyMod/localization/default.lua',
                lastModified: new Date(),
                input: `return {
    descriptions = {
        ${consumableSet} = {
            c_mymod_${consumableKey} = {
                name = "${consumableLocName}",
                text = {
                ${newText}
                }
            }
        }
    }
}`
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
        <LabelField name="consumableKey" label="Key:" bind:value={consumableKey} on:input={updateShareCode} />
        <LabelField name="consumableName" label="Name:" bind:value={consumableLocName} on:input={updateShareCode} />
        <LabelTextArea name="consumableLocText" label='Description:' bind:value={consumableLocText} on:input={updateShareCode} />
        <LabelDropdown name="consumableSet" label="Set:" bind:value={consumableSet} on:change={updateShareCode} options={consumableSets.map(set => {return {label: set, value: set}})} />
        <LabelField name="consumableAtlas" label="Atlas:" bind:value={consumableAtlas} on:input={updateShareCode} />
        <LabelNumberInput name="consumableCost" label="Cost:" bind:value={consumableCost} on:input={updateShareCode} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name="consumablePosX" label="Atlas X:" bind:value={consumablePosX} on:input={updateShareCode} />
            <LabelNumberInput name="consumablePosY" label="Atlas Y:" bind:value={consumablePosY} on:input={updateShareCode} />
        </div>
        <LabelCheckbox name='consumableDiscovered' label='Discovered' bind:value={consumableDiscovered} on:change={updateShareCode} />
        <LabelCheckbox name='consumableUnlocked' label='Unlocked' bind:value={consumableUnlocked} on:change={updateShareCode} />
        <LabelCheckbox name='consumableHidden' label='Hidden' bind:value={consumableHidden} on:change={updateShareCode} />

        {#if consumableHidden}
            <p class="mt-2 text-3xl">Hidden Settings</p>
            <LabelDropdown name="consumableSoulSet" label="Set:" bind:value={consumableSoulSet} on:input={updateShareCode} options={consumableSets.map(set => {return {label: set, value: set}})} />
            <LabelNumberInput name="consumableSoulRate" label="Rate of appearing:" max={1.0} step={0.001} bind:value={consumableSoulRate} on:input={updateShareCode} />
            <LabelCheckbox name="consumableCanRepeatSoul" label="Can repeat" bind:value={consumableCanRepeatSoul} on:change={updateShareCode} />
        {/if}

        <p class="mt-2 text-3xl">Localization</p>

        <div class="flex flex-col gap-2">
            {#each consumableLocalizationEntries as entry, i}
                <div class="flex flex-col gap-2">
                    <LabelDropdown name="consumableLocalizationEntry_{i}_locale" label="Locale:" bind:value={entry.locale} options={localeList.map((loc) => { return { label: loc, value: loc }})} on:change={() => {
                        consumableLocalizationEntries = consumableLocalizationEntries
                        updateShareCode()
                    }} />
                    <LabelField name="consumableLocalizationEntry_{i}_name" label="Name:" on:input={() => {
                        consumableLocalizationEntries = consumableLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.name} />
                    <LabelTextArea name="consumableLocalizationEntry_{i}_text" label="Description:" on:input={() => {
                        consumableLocalizationEntries = consumableLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.text} />

                    <Button name="removeLocalizationEntry_{i}" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={() => removeLocalizationEntry(i)}>
                        Remove Entry
                    </Button>
                </div>
            {/each}

            <Button name="addLocalizationEntry" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={addLocalizationEntry}>
                Add Entry
            </Button>
        </div>

        <p class="mt-2 text-3xl">Variables</p>

        <div class="flex flex-col gap-2">
            {#each consumablePreviewVariables as variable, i}
                <div class="flex flex-row gap-4">
                    <LabelField name="consumableVariable_{i}_name" label="Name:" on:input={() => {
                        consumablePreviewVariables = consumablePreviewVariables
                        updateShareCode()
                    }} bind:value={variable.name} />
                    <LabelField name="consumableVariable_{i}" label="Value:" on:input={() => {
                        consumablePreviewVariables = consumablePreviewVariables
                        updateShareCode()
                    }} bind:value={variable.value}>
                        <Button slot="after-input" class="text-base h-8 leading-4" name="removeVariable_{i}" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={() => removeVariable(i)}>
                            Remove
                        </Button>
                    </LabelField>
                </div>
            {/each}

            <Button name="addVariable" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={addVariable}>
                Add Variable
            </Button>
        </div>
    </div>
    <div class="flex-1 flex flex-col min-h-[50rem] gap-4">
        <div class="flex flex-col items-center gap-4">
            <ImageDrop />

            <CardDescription name={consumableLocName} description={resolvedLocText}>
                {#if consumableSet === 'Tarot'}
                    <Tag text="Tarot" colour="#a782d1" shadowColour="#8668a7" />
                {:else if consumableSet === 'Planet'}
                    <Tag text="Planet" colour="#13afce" shadowColour="#0f8ca5" />
                {:else if consumableSet === 'Spectral'}
                    <Tag text="Spectral" colour="#4584fa" shadowColour="#376ac8" />
                {/if}
            </CardDescription>
        </div>

        <Highlight language={lua} code={codePreview} let:highlighted>
            <LineNumbers {highlighted} />
        </Highlight>

        <div class="flex flex-row gap-4">
            <Button name="copyCode" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={copyCode}>Copy to clipboard</Button>
            <Button name="downloadZip" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={downloadModZip}>Download as mod</Button>
        </div>
    </div>
</div>
