<script lang="ts">
    import Highlight, { LineNumbers } from "svelte-highlight"
    import { Button, TabContentItem, TabHeadItem, TabHead, TabView } from "$lib/components"
    import { _ } from 'svelte-i18n'
    import type { CodeFile } from "$lib"


    interface Props {
        files?: CodeFile[];
        activeTabValue?: number;
    }

    let { files = [], activeTabValue = $bindable(0) }: Props = $props();

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
            <TabHeadItem id={i} liClass="bg-[#282c34] p-4 {activeTabValue == i ? 'border-b-2' : ''}" onClick={handleClick(i)}>{file.fileName}</TabHeadItem>
        {/each}
        
        {#snippet afterTabList()}
            <div class="ml-auto self-center mr-1">
                <Button name="copyCode" color="#FE5F55" hoverColor="#fe6f66" activeColor="#cb4c44" action={copyCode}>{$_('editor.copyClipboard')}</Button>
            </div>
        {/snippet}
    </TabHead>
    {#each files as file, i}
        <TabContentItem id={i} {activeTabValue} class="">
            <!-- TODO: Replace with Svelte 5 syntax once Highlight uses it -->
            <Highlight language={file.lang} code={file.content} let:highlighted>
                <LineNumbers {highlighted} />
            </Highlight>
        </TabContentItem>
    {/each}
</TabView>