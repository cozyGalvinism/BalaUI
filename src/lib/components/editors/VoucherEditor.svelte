<script lang="ts">
    import { run } from 'svelte/legacy';

    import { localeList, toShareCode, type CodeFile, type VoucherData } from "$lib"
    import { LabelField, TabbedHighlight, Button, LabelDropdown, Tag, CardDescription, ImageDrop, LabelCheckbox, LabelNumberInput, LabelTextArea } from "$lib/components"
    import { _ } from 'svelte-i18n'
    import lua from "svelte-highlight/languages/lua"
    import json from "svelte-highlight/languages/json"
    import { downloadZip } from "client-zip"
    import { goto } from "$app/navigation"
    import atomOneDark from "svelte-highlight/styles/atom-one-dark";

    interface Props {
        initialVoucherData?: VoucherData | null;
    }

    let { initialVoucherData = null }: Props = $props();
    let code = '';

    let voucherKey = $state(initialVoucherData?.key ?? 'replace_me')
    let voucherLocName = $state(initialVoucherData?.locName ?? 'Blank')
    let voucherLocText = $state(initialVoucherData?.locText ?? '{C:inactive}Does nothing?')
    let voucherCost = $state(initialVoucherData?.cost ?? 0)
    let voucherPosX = $state(initialVoucherData?.posX ?? 0)
    let voucherPosY = $state(initialVoucherData?.posY ?? 0)
    let voucherAtlas = $state(initialVoucherData?.atlas ?? '')
    let voucherUnlocked = $state(initialVoucherData?.unlocked ?? true)
    let voucherDiscovered = $state(initialVoucherData?.discovered ?? false)
    let voucherRequires = $state(initialVoucherData?.requires ?? [])
    let voucherPreviewVariables = $state(initialVoucherData?.previewVariables ?? [])
    let voucherLocalizationEntries = $state(initialVoucherData?.localization ?? [])

    let activeTabValue: number = $state(0)

    let resolvedLocText = $derived.by(() => {
        let tmp = voucherLocText;

        voucherPreviewVariables.forEach((variable, index) => {
            tmp = tmp.replace(new RegExp(`#${index + 1}#`, 'g'), variable.value);
        });

        return tmp;
    });

    let codePreview = $derived.by(() => {
        let codePreview = `--- STEAMODDED HEADER
--- MOD_NAME: MyMod
--- MOD_ID: MyMod
--- MOD_AUTHOR: [Your Name]
--- MOD_DESCRIPTION: A mod
--- VERSION: 1.0.0
--- PREFIX: mymod
----------------------------------------------
------------MOD CODE -------------------------

SMODS.Voucher{
    key = '${voucherKey}'`

        if (voucherDiscovered) {
            codePreview += `,\n    discovered = true`
        }

        if (!voucherUnlocked) {
            codePreview += `,\n    unlocked = false`
        }

        if (voucherAtlas) {
            codePreview += `,\n    atlas = '${voucherAtlas}'`
        }

        if (voucherCost) {
            codePreview += `,\n    cost = ${voucherCost}`
        }

        codePreview += `,\n    pos = {x = ${voucherPosX}, y = ${voucherPosY}}`

        codePreview += `,\n    config = { extra = {${voucherPreviewVariables.map((variable) => `${variable.name} = '${variable.value}'`).join(', ')}} }`

        codePreview += `,\n    requires = {${voucherRequires.map((requirement) => `'${requirement}'`).join(', ')}}`

        codePreview += `,\n    loc_vars = function(self, info_queue)
        return { vars = {} }
    end`

        codePreview += `,\n    redeem = function(self)\n    end`

        codePreview = codePreview.trimEnd().replace(/,\s*$/, '') + '\n}'

        codePreview = codePreview + `

----------------------------------------------
------------MOD CODE END----------------------`

        return codePreview;
    });
    let previewFiles: CodeFile[] = $derived.by(() => {
        let previewFiles = [
            {
                fileName: 'MyMod/MyMod.lua',
                content: codePreview,
                lang: lua
            },
            {
                fileName: 'MyMod/localization/default.json',
                content: JSON.stringify({
                    descriptions: {
                        Voucher: {
                            [`v_mymod_${voucherKey}`]: {
                                name: voucherLocName,
                                description: voucherLocText.split('\n')
                            }
                        }
                    }
                }, null, 2),
                lang: json
            },
            ...voucherLocalizationEntries.map(locEntry => {
                return {
                    fileName: `MyMod/localization/${locEntry.locale}.json`,
                    content: JSON.stringify({
                        descriptions: {
                            Voucher: {
                                [`v_mymod_${voucherKey}`]: {
                                    name: locEntry.name,
                                    description: locEntry.text.split('\n')
                                }
                            }
                        }
                    }, null, 2),
                    lang: json
                }
            })
        ];

        return previewFiles;
    });

    function addRequire() {
        voucherRequires = [...voucherRequires, '']
    }

    function removeRequire(index: number) {
        voucherRequires = voucherRequires.filter((_, i) => i !== index)
    }

    function addVariable() {
        voucherPreviewVariables = [...voucherPreviewVariables, {name: '', value: ''}]
        updateShareCode()
    }

    function removeVariable(index: number) {
        voucherPreviewVariables = voucherPreviewVariables.filter((_, i) => i !== index)
        updateShareCode()
    }

    function addLocalizationEntry() {
        voucherLocalizationEntries = [...voucherLocalizationEntries, {name: '', text: '', locale: ''}]
        updateShareCode()
    }

    function removeLocalizationEntry(index: number) {
        voucherLocalizationEntries = voucherLocalizationEntries.filter((_, i) => i !== index)
        updateShareCode()
    }

    async function downloadModZip() {
        let localizationFiles = []

        for (let i = 0; i < voucherLocalizationEntries.length; i++) {
            const locEntry = voucherLocalizationEntries[i]
            localizationFiles.push({
                name: `MyMod/localization/${locEntry.locale}.json`,
                lastModified: new Date(),
                input: JSON.stringify({
                    descriptions: {
                        Voucher: {
                            [`v_mymod_${voucherKey}`]: {
                                name: locEntry.name,
                                description: locEntry.text.split('\n')
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
                        Voucher: {
                            [`v_mymod_${voucherKey}`]: {
                                name: voucherLocName,
                                description: voucherLocText.split('\n')
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

    function updateShareCode() {
        const voucherData: VoucherData = {
            key: voucherKey,
            locName: voucherLocName,
            locText: voucherLocText,
            atlas: voucherAtlas,
            cost: voucherCost,
            posX: voucherPosX,
            posY: voucherPosY,
            requires: voucherRequires,
            previewVariables: voucherPreviewVariables,
            localization: voucherLocalizationEntries,
            unlocked: voucherUnlocked,
            discovered: voucherDiscovered
        }
        const newCode = toShareCode(voucherData)

        if(newCode !== code) {
            code = newCode

            goto('?code=' + newCode, { replaceState: true, keepFocus: true, noScroll: true })
        }
    }
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="flex flex-row gap-2">
    <div class="text-2xl flex-1 flex flex-col gap-1">
        <LabelField name="voucherKey" label={$_('editor.key')} bind:value={voucherKey} onInput={updateShareCode} />
        <LabelField name="voucherLocName" label={$_('editor.name')} bind:value={voucherLocName} onInput={updateShareCode} />
        <LabelTextArea name="voucherLocText" label={$_('editor.description')} bind:value={voucherLocText} onInput={updateShareCode} />
        <LabelField name="voucherAtlas" label={$_('editor.atlas')} bind:value={voucherAtlas} onInput={updateShareCode} />
        <LabelNumberInput name="voucherCost" label={$_('editor.cost')} bind:value={voucherCost} onInput={updateShareCode} />
        <div class="flex flex-row gap-4">
            <LabelNumberInput name="voucherPosX" label={$_('editor.atlasX')} bind:value={voucherPosX} onInput={updateShareCode} />
            <LabelNumberInput name="voucherPosY" label={$_('editor.atlasY')} bind:value={voucherPosY} onInput={updateShareCode} />
        </div>
        <LabelCheckbox name="voucherUnlocked" label={$_('editor.unlocked')} bind:value={voucherUnlocked} onChange={updateShareCode} />
        <LabelCheckbox name="voucherDiscovered" label={$_('editor.discovered')} bind:value={voucherDiscovered} onChange={updateShareCode} />

        <p class="mt-2 text-3xl">{$_('editor.voucher.requires.title')}</p>
        <div class="flex flex-col gap-2">
            {#each voucherRequires as require, i}
                <div class="flex flex-row gap-2">
                    <LabelField name="voucherRequires_{i}_key" label={$_('editor.key')} bind:value={voucherRequires[i]} onInput={() => {
                        voucherRequires = voucherRequires
                        updateShareCode()
                    }}>
                        {#snippet afterInput()}
                            <Button class="text-base h-8 leading-4" name="removeRequire_{i}" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={() => removeRequire(i)}>
                                {$_('editor.voucher.requires.remove')}
                            </Button>
                        {/snippet}
                    </LabelField>
                </div>
            {/each}

            <Button name="addRequire" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={addRequire}>
                {$_('editor.voucher.requires.add')}
            </Button>
        </div>

        <p class="mt-2 text-3xl">{$_('editor.localization.title')}</p>
        <div class="flex flex-col gap-2">
            {#each voucherLocalizationEntries as entry, i}
                <div class="flex flex-col gap-2">
                    <LabelDropdown name="voucherLocalizationEntry_{i}_locale" label={$_('editor.localization.locale')} bind:value={entry.locale} options={localeList.map((loc) => { return { label: loc, value: loc }})} onChange={() => {
                        voucherLocalizationEntries = voucherLocalizationEntries
                        updateShareCode()
                    }} />
                    <LabelField name="voucherLocalizationEntry_{i}_name" label={$_('editor.name')} onInput={() => {
                        voucherLocalizationEntries = voucherLocalizationEntries
                        updateShareCode()
                    }} bind:value={entry.name} />
                    <LabelTextArea name="voucherLocalizationEntry_{i}_text" label={$_('editor.description')} onInput={() => {
                        voucherLocalizationEntries = voucherLocalizationEntries
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
            {#each voucherPreviewVariables as variable, i}
                <div class="flex flex-row gap-4">
                    <LabelField name="consumableVariable_{i}_name" label={$_('editor.name')} onInput={() => {
                        voucherPreviewVariables = voucherPreviewVariables
                        updateShareCode()
                    }} bind:value={variable.name} />
                    <LabelField name="consumableVariable_{i}" label={$_('editor.value')} onInput={() => {
                        voucherPreviewVariables = voucherPreviewVariables
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
            <ImageDrop width={142} height={190} />

            <CardDescription name={voucherLocName} description={resolvedLocText}>
                <Tag text={$_('balatro.voucher')} colour="#fd682b" shadowColour="#ca5322" />
            </CardDescription>
        </div>

        <TabbedHighlight files={previewFiles} bind:activeTabValue={activeTabValue} />
        <Button name="downloadZip" color="#4BC292" hoverColor="#6fcea8" activeColor="#3c9b75" action={downloadModZip}>{$_('editor.downloadMod')}</Button>
    </div>
</div>