<script lang="ts">
    import Highlight, { LineNumbers } from "svelte-highlight";
    import LabelField from "./LabelField.svelte"
    import lua from "svelte-highlight/languages/lua"
    import atomOneDark from "svelte-highlight/styles/atom-one-dark";
    import LabelDropdown from "./LabelDropdown.svelte"
    import ImageDrop from "./ImageDrop.svelte"
    import LabelCheckbox from "./LabelCheckbox.svelte"
    import LabelNumberInput from "./LabelNumberInput.svelte"
    import LabelTextArea from "./LabelTextArea.svelte"
    import CardDescription from "./CardDescription.svelte"
    import Button from "./Button.svelte"
    import { downloadZip } from "client-zip"
    import { localeList, type JokerData, type LocalizationEntry, type PreviewVariable } from "$lib"
    import { goto } from "$app/navigation"
    import Tag from "./Tag.svelte"

    export let initialJokerData: JokerData | null = null;
    let code = '';

    function updateShareCode() {
        const newCode = btoa(JSON.stringify({
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
        } as JokerData))

        if (newCode !== code) {
            code = newCode

            goto('?code=' + newCode, { replaceState: true, keepFocus: true, noScroll: true })
        }
    }

    let jokerKey = initialJokerData?.key || 'replace_me';
    let jokerRarity = initialJokerData?.rarity || 1;
    let jokerDiscovered = initialJokerData?.discovered || false;
    let jokerUnlocked = initialJokerData?.unlocked || true;
    let jokerAtlas = initialJokerData?.atlas || '';
    let jokerPosX = initialJokerData?.posX || 0;
    let jokerPosY = initialJokerData?.posY || 0;
    let jokerLocName = initialJokerData?.locName || 'Placeholder Joker';
    let jokerLocText = initialJokerData?.locText || '{C:mult}+4{} Mult';
    let jokerCost = initialJokerData?.cost || 0;
    let jokerBlueprintCompat = initialJokerData?.blueprintCompat || false;
    let jokerEternalCompat = initialJokerData?.eternalCompat || true;
    let jokerPerishableCompat = initialJokerData?.perishableCompat || true;

    let jokerPreviewVariables: PreviewVariable[] = initialJokerData?.previewVariables || [];
    let jokerLocalizationEntries: LocalizationEntry[] = initialJokerData?.localization || [];

    let resolvedLocText = '';
    $: {
        resolvedLocText = jokerLocText;

        jokerPreviewVariables.forEach((variable, index) => {
            resolvedLocText = resolvedLocText.replace(`#${index + 1}#`, variable.value);
        });
    }

    async function downloadModZip() {
        const splitText = jokerLocText.split('\n')
        const newText = splitText.map(line => `    '${line}'`).join(',\n                ')

        let localizationFiles = []

        for (let i = 0; i < jokerLocalizationEntries.length; i++) {
            const locEntry = jokerLocalizationEntries[i]
            const splitText = locEntry.text.split('\n')
            const newText = splitText.map(line => `    '${line}'`).join(',\n                ')
            localizationFiles.push({
                name: `MyMod/localization/${locEntry.locale}.lua`,
                lastModified: new Date(),
                input: `return {
    descriptions = {
        Joker = {
            j_mymod_${jokerKey} = {
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
        Joker = {
            j_mymod_${jokerKey} = {
                name = "${jokerLocName}",
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

SMODS.Joker{
    key = '${jokerKey}'`

        if (jokerRarity) {
            codePreview += `,\n    rarity = ${jokerRarity}`
        }

        if (jokerDiscovered) {
            codePreview += `,\n    discovered = true`
        }

        if (!jokerUnlocked) {
            codePreview += `,\n    unlocked = false`
        }

        if (jokerAtlas) {
            codePreview += `,\n    atlas = '${jokerAtlas}'`
        }

        if (jokerCost) {
            codePreview += `,\n    cost = ${jokerCost}`
        }

        if (jokerBlueprintCompat) {
            codePreview += `,\n    blueprint_compat = true`
        }

        if (!jokerEternalCompat) {
            codePreview += `,\n    eternal_compat = false`
        }

        if (!jokerPerishableCompat) {
            codePreview += `,\n    perishable_compat = false`
        }

        codePreview += `,\n    pos = { x = ${jokerPosX}, y = ${jokerPosY} }`

        codePreview += `,\n    config = { extra = {${jokerPreviewVariables.map((variable) => `${variable.name} = '${variable.value}'`)}} }`

        codePreview += `,\n    loc_vars = function(self, info_queue, card)
        return { vars = {${jokerPreviewVariables.map((variable) => `card.ability.extra.${variable.name}`).join(', ')}} }
    end`

        codePreview += `,\n    calculate = function(self, card, context)\n    end`

        codePreview = codePreview.trimEnd().replace(/,\s*$/, '') + '\n}'

        codePreview = codePreview + `

----------------------------------------------
------------MOD CODE END----------------------`
    }

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
        updateShareCode()
    }
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="m6x11plus flex flex-row gap-2">
    <div class="text-2xl flex-1 flex flex-col gap-1">
        <LabelField name='jokerKey' label='Key:' bind:value={jokerKey} on:input={updateShareCode} />
        <LabelField name='jokerLocName' label='Name:' bind:value={jokerLocName} on:input={updateShareCode} />
        <LabelTextArea name='jokerLocText' label='Description:' bind:value={jokerLocText} on:input={updateShareCode} />
        <LabelDropdown name='jokerRarity' label='Rarity:' on:change={updateShareCode} bind:value={jokerRarity} options={[{value: 1, label: 'Common'}, {value: 2, label: 'Uncommon'}, {value: 3, label: 'Rare'}, {value: 4, label: 'Legendary'}]} />
        <LabelField name='jokerAtlas' label='Atlas:' bind:value={jokerAtlas} on:input={updateShareCode} />
        <LabelNumberInput name='jokerCost' label='Cost:' bind:value={jokerCost} on:input={updateShareCode} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name='jokerPosX' label='Atlas X:' bind:value={jokerPosX} on:input={updateShareCode} />
            <LabelNumberInput name='jokerPosY' label='Atlas Y:' bind:value={jokerPosY} on:input={updateShareCode} />
        </div>
        <LabelCheckbox name='jokerDiscovered' label='Discovered' bind:value={jokerDiscovered} on:change={updateShareCode} />
        <LabelCheckbox name='jokerUnlocked' label='Unlocked' bind:value={jokerUnlocked} on:change={updateShareCode} />
        <LabelCheckbox name='jokerBlueprintCompat' label='Compatible with Blueprint' bind:value={jokerBlueprintCompat} on:change={updateShareCode} />
        <LabelCheckbox name='jokerEternalCompat' label='Compatible with Eternal' bind:value={jokerEternalCompat} on:change={updateShareCode} />
        <LabelCheckbox name='jokerPerishableCompat' label='Compatible with Perishable' bind:value={jokerPerishableCompat} on:change={updateShareCode} />

        <p class="mt-2 text-3xl">Localization</p>

        <div class="flex flex-col gap-2">
            {#each jokerLocalizationEntries as entry, i}
                <div class="flex flex-col gap-2">
                    <LabelDropdown name="jokerLocalizationEntry_{i}_locale" label="Locale:" bind:value={entry.locale} options={localeList.map((loc) => { return { label: loc, value: loc }})} on:change={() => {
                        jokerLocalizationEntries = jokerLocalizationEntries
                        updateShareCode()
                    }} />
                    <LabelField name="jokerLocalizationEntry_{i}_name" label="Name:" on:input={() => {
                        jokerLocalizationEntries = jokerLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.name} />
                    <LabelTextArea name="jokerLocalizationEntry_{i}_text" label="Description:" on:input={() => {
                        jokerLocalizationEntries = jokerLocalizationEntries
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
            {#each jokerPreviewVariables as variable, i}
                <div class="flex flex-row gap-4">
                    <LabelField name="jokerVariable_{i}_name" label="Name:" on:input={() => {
                        jokerPreviewVariables = jokerPreviewVariables
                        updateShareCode()
                    }} bind:value={variable.name} />
                    <LabelField name="jokerVariable_{i}" label="Value:" on:input={() => {
                        jokerPreviewVariables = jokerPreviewVariables
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

            <CardDescription name={jokerLocName} description={resolvedLocText}>
                {#if jokerRarity == 1}
                    <Tag text="Common" colour="#009dff" shadowColour="#007ecc" />
                {:else if jokerRarity == 2}
                    <Tag text="Uncommon" colour="#4BC292" shadowColour="#3c9b75" />
                {:else if jokerRarity == 3}
                    <Tag text="Rare" colour="#fe5f55" shadowColour="#cb4c44" />
                {:else if jokerRarity == 4}
                    <Tag text="Legendary" colour="#b26cbb" shadowColour="#8e5696"  />
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
