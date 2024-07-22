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

    let jokerKey = '';
    let jokerName = '';
    let jokerRarity = 1;
    let jokerDiscovered = false;
    let jokerUnlocked = false;
    let jokerAtlas = '';
    let jokerPosX = 0;
    let jokerPosY = 0;
    let jokerLocName = '';
    let jokerLocText = '';
    let jokerCost = 0;
    let jokerBlueprintCompat = false;
    let jokerEternalCompat = true;
    let jokerPerishableCompat = true;

    let jokerPreviewVariables: string[] = [];

    let resolvedLocText = '';
    $: {
        resolvedLocText = jokerLocText;

        jokerPreviewVariables.forEach((variable, index) => {
            resolvedLocText = resolvedLocText.replace(`#${index + 1}#`, variable);
        });
    }

    function updateResolvedLocText() {
        resolvedLocText = jokerLocText;

        jokerPreviewVariables.forEach((variable, index) => {
            resolvedLocText = resolvedLocText.replace(`#${index + 1}#`, variable);
        });
    }

    let codePreview = ''

    $: {
        codePreview = `SMODS.Joker{
    key = '${jokerKey}'`

        if (jokerName) {
            codePreview += `,\n    name = '${jokerName}'`
        }

        if (jokerRarity) {
            codePreview += `,\n    rarity = ${jokerRarity}`
        }

        if (jokerDiscovered) {
            codePreview += `,\n    discovered = true`
        }

        if (jokerUnlocked) {
            codePreview += `,\n    unlocked = true`
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

        if (jokerLocName && jokerLocText) {
            const splitText = jokerLocText.split('\n')
            const newText = splitText.map(line => `        '${line}'`).join(',\n    ')
            codePreview += `,\n    loc_txt = {\n        name = '${jokerLocName}',\n        text = {\n    ${newText} \n        }\n    }`
        } else if (jokerLocName) {
            codePreview += `,\n    loc_txt = {\n        name = '${jokerLocName}'\n    }`
        } else if (jokerLocText) {
            codePreview += `,\n    loc_txt = {\n        text = {\n    ${jokerLocText.split('\n').map(line => `        '${line}'`).join(',\n    ')} \n        }\n    }`
        }

        codePreview += `,\n    pos = { x = ${jokerPosX}, y = ${jokerPosY} }`

        codePreview += `,\n    loc_vars = function(self, info_queue, card)\n    end`

        codePreview += `,\n    calculate = function(self, card, context)\n    end`

        codePreview = codePreview.trimEnd().replace(/,\s*$/, '') + '\n}'
    }

    function copyCode() {
        navigator.clipboard.writeText(codePreview)
    }

    function addVariable() {
        jokerPreviewVariables = [...jokerPreviewVariables, '']
    }

    function removeVariable(index: number) {
        jokerPreviewVariables = jokerPreviewVariables.filter((_, i) => i !== index)
    }
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="m6x11plus flex flex-row gap-2">
    <div class="text-2xl flex-1 flex flex-col gap-1">
        <LabelField name='jokerKey' label='Key:' bind:value={jokerKey} />
        <LabelField name='jokerName' label='Name:' bind:value={jokerName} />
        <LabelDropdown name='jokerRarity' label='Rarity:' bind:value={jokerRarity} options={[{value: 1, label: 'Common'}, {value: 2, label: 'Uncommon'}, {value: 3, label: 'Rare'}, {value: 4, label: 'Legendary'}]} />
        <LabelField name='jokerAtlas' label='Atlas:' bind:value={jokerAtlas} />
        <LabelNumberInput name='jokerCost' label='Cost:' bind:value={jokerCost} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name='jokerPosX' label='Atlas X:' bind:value={jokerPosX} />
            <LabelNumberInput name='jokerPosY' label='Atlas Y:' bind:value={jokerPosY} />
        </div>
        <LabelField name='jokerLocName' label='Localized Name:' bind:value={jokerLocName} />
        <LabelTextArea name='jokerLocText' label='Localized Text:' bind:value={jokerLocText} />
        <LabelCheckbox name='jokerDiscovered' label='Discovered' bind:value={jokerDiscovered} />
        <LabelCheckbox name='jokerUnlocked' label='Unlocked' bind:value={jokerUnlocked} />
        <LabelCheckbox name='jokerBlueprintCompat' label='Compatible with Blueprint' bind:value={jokerBlueprintCompat} />
        <LabelCheckbox name='jokerEternalCompat' label='Compatible with Eternal' bind:value={jokerEternalCompat} />
        <LabelCheckbox name='jokerPerishableCompat' label='Compatible with Perishable' bind:value={jokerPerishableCompat} />

        <p class="mt-2 text-3xl">Variables (Preview only)</p>

        <div class="flex flex-col gap-2">
            {#each jokerPreviewVariables as variable, i}
                <div class="flex flex-row gap-4">
                    <LabelField name="jokerVariable_{i}" label="Variable {i + 1}:" on:input={() => jokerPreviewVariables = jokerPreviewVariables} bind:value={variable}>
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

        <Button name="copyCode2" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={copyCode}>Copy to clipboard</Button>
    </div>
</div>
