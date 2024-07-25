<script lang="ts">
    import Highlight, { LineNumbers } from "svelte-highlight"
    import Button from "./Button.svelte"
    import TabContentItem from "./TabContentItem.svelte"
    import TabHead from "./TabHead.svelte"
    import TabHeadItem from "./TabHeadItem.svelte"
    import TabView from "./TabView.svelte"
    import { _ } from 'svelte-i18n'
    import type { CodeFile } from "$lib"

    export let files: CodeFile[] = []

    export let activeTabValue = 0

    function handleClick(tabValue: number) {
        return () => (activeTabValue = tabValue)
    }

    function copyCode() {
        const codePreview = files[activeTabValue].content
        console.log("copied!")
        navigator.clipboard.writeText(codePreview)
    }
</script>

<TabView>
    <TabHead divClass="bg-[#53565d] rounded-t-md p-1 pb-0 flex flex-row">
        {#each files as file, i}
            <TabHeadItem id={i} liClass="bg-[#282c34] p-4 {activeTabValue == i ? 'border-b-2' : ''}" on:click={handleClick(i)}>{file.fileName}</TabHeadItem>
        {/each}
        <div class="ml-auto self-center mr-1" slot="after-tablist">
            <Button name="copyCode" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={copyCode}>{$_('editor.copyClipboard')}</Button>
        </div>
    </TabHead>
    {#each files as file, i}
        <TabContentItem id={i} {activeTabValue} class="">
            <Highlight language={file.lang} code={file.content} let:highlighted>
                <LineNumbers {highlighted} />
            </Highlight>
        </TabContentItem>
    {/each}
</TabView>