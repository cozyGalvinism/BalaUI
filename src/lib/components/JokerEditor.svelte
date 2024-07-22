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
    import { label } from "three/examples/jsm/nodes/Nodes.js"

    const localeList = [
        'de',
        'en-us',
        'es_419',
        'es_ES',
        'fr',
        'id',
        'it',
        'ja',
        'ko',
        'nl',
        'pl',
        'pt_BR',
        'ru',
        'zh_CN',
        'zh_TW',
    ];

    let jokerKey = 'replace_me';
    let jokerRarity = 1;
    let jokerDiscovered = false;
    let jokerUnlocked = true;
    let jokerAtlas = '';
    let jokerPosX = 0;
    let jokerPosY = 0;
    let jokerLocName = '';
    let jokerLocText = '';
    let jokerCost = 0;
    let jokerBlueprintCompat = false;
    let jokerEternalCompat = true;
    let jokerPerishableCompat = true;

    let jokerPreviewVariables: PreviewVariable[] = [];
    let jokerLocalizationEntries: LocalizationEntry[] = [];

    type PreviewVariable = {
        name: string
        value: string
    }

    type LocalizationEntry = {
        name: string
        text: string
        locale: string
    }

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
    }

    function removeVariable(index: number) {
        jokerPreviewVariables = jokerPreviewVariables.filter((_, i) => i !== index)
    }

    function addLocalizationEntry() {
        jokerLocalizationEntries = [...jokerLocalizationEntries, {name: '', text: '', locale: ''}]
    }

    function removeLocalizationEntry(index: number) {
        jokerLocalizationEntries = jokerLocalizationEntries.filter((_, i) => i !== index)
    }
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="m6x11plus flex flex-row gap-2">
    <div class="text-2xl flex-1 flex flex-col gap-1">
        <LabelField name='jokerKey' label='Key:' bind:value={jokerKey} />
        <LabelField name='jokerLocName' label='Name:' bind:value={jokerLocName} />
        <LabelTextArea name='jokerLocText' label='Description:' bind:value={jokerLocText} />
        <LabelDropdown name='jokerRarity' label='Rarity:' bind:value={jokerRarity} options={[{value: 1, label: 'Common'}, {value: 2, label: 'Uncommon'}, {value: 3, label: 'Rare'}, {value: 4, label: 'Legendary'}]} />
        <LabelField name='jokerAtlas' label='Atlas:' bind:value={jokerAtlas} />
        <LabelNumberInput name='jokerCost' label='Cost:' bind:value={jokerCost} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name='jokerPosX' label='Atlas X:' bind:value={jokerPosX} />
            <LabelNumberInput name='jokerPosY' label='Atlas Y:' bind:value={jokerPosY} />
        </div>
        <LabelCheckbox name='jokerDiscovered' label='Discovered' bind:value={jokerDiscovered} />
        <LabelCheckbox name='jokerUnlocked' label='Unlocked' bind:value={jokerUnlocked} />
        <LabelCheckbox name='jokerBlueprintCompat' label='Compatible with Blueprint' bind:value={jokerBlueprintCompat} />
        <LabelCheckbox name='jokerEternalCompat' label='Compatible with Eternal' bind:value={jokerEternalCompat} />
        <LabelCheckbox name='jokerPerishableCompat' label='Compatible with Perishable' bind:value={jokerPerishableCompat} />

        <p class="mt-2 text-3xl">Localization</p>

        <div class="flex flex-col gap-2">
            {#each jokerLocalizationEntries as entry, i}
                <div class="flex flex-col gap-2">
                    <LabelDropdown name="jokerLocalizationEntry_{i}_locale" label="Locale:" bind:value={entry.locale} options={localeList.map((loc) => { return { label: loc, value: loc }})} />
                    <LabelField name="jokerLocalizationEntry_{i}_name" label="Name:" on:input={() => jokerLocalizationEntries = jokerLocalizationEntries} bind:value={entry.name} />
                    <LabelTextArea name="jokerLocalizationEntry_{i}_text" label="Description:" on:input={() => jokerLocalizationEntries = jokerLocalizationEntries} bind:value={entry.text} />

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
                    <LabelField name="jokerVariable_{i}_name" label="Name:" on:input={() => jokerPreviewVariables = jokerPreviewVariables} bind:value={variable.name} />
                    <LabelField name="jokerVariable_{i}" label="Value:" on:input={() => jokerPreviewVariables = jokerPreviewVariables} bind:value={variable.value}>
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

            <CardDescription name={jokerLocName} description={resolvedLocText} rarity={jokerRarity} />
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
