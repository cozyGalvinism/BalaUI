<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'
    import { JumpingText } from '$lib/components'
    import {_} from 'svelte-i18n'

    interface Props {
        width?: number;
        height?: number;
    }

    let { width = 284, height = 380 }: Props = $props();

    let image: string | null = $state(null)
    let imageFile: File | null = null
    let fileInput: HTMLInputElement | null = $state(null)
    const imageSrc = writable<string | null>(null)

    function handleImageDrop(event: DragEvent) {
        event.preventDefault()
        if (
            event.dataTransfer &&
            event.dataTransfer.files &&
            event.dataTransfer.files[0]
        ) {
            const droppedFile = event.dataTransfer.files[0]
            imageFile = droppedFile
            const reader = new FileReader()
            reader.onload = () => {
                image = reader.result as string
                imageSrc.set(image)
            }
            reader.readAsDataURL(droppedFile)
        }
    }

    function handleImageSelection(event: Event) {
        const fileInput = event.target as HTMLInputElement
        if (fileInput.files && fileInput.files[0]) {
            imageFile = fileInput.files[0]
            const reader = new FileReader()
            reader.onload = () => {
                image = reader.result as string
                imageSrc.set(image)
            }
            reader.readAsDataURL(fileInput.files[0])
        }
    }

    onMount(() => {
        const dropZone = document.getElementById('drop-zone')
        if (dropZone) {
            dropZone.addEventListener('dragover', (event) => {
                event.preventDefault()
                dropZone.classList.add('dragover')
            })
            dropZone.addEventListener('dragleave', (event) => {
                event.preventDefault()
                dropZone.classList.remove('dragover')
            })
            dropZone.addEventListener('drop', handleImageDrop)
        }
    })
</script>

<div class="flex flex-col items-center">
    <button
        id="drop-zone"
        class="{image
            ? ''
            : 'p-4 border-2 border-dashed border-gray-500 bg-[#00000050]'} cursor-pointer rounded-lg drop-zone"
        aria-dropeffect="copy"
        tabindex="0"
        style="--image-drop-width: {width}px; --image-drop-height: {height}px;"
        aria-label={$_('imageDrop.ariaLabel')}
        ondrop={handleImageDrop}
        ondragover={(event) => event.preventDefault()}
        ondragleave={(event) => event.preventDefault()}
        onclick={() => fileInput?.click()}
    >
        {#if image}
            <img src={$imageSrc} alt="{$_('imageDrop.alt')}" class="h-full preview" />
        {:else}
            <div class="text-center flex items-center h-full">
                <JumpingText className="text-xl" text={$_('imageDrop.text')} />
            </div>
        {/if}
    </button>
    <input
        type="file"
        class="hidden"
        onchange={handleImageSelection}
        accept="image/*"
        bind:this={fileInput}
    />
</div>

<style>
    .preview {
        image-rendering: pixelated;
    }

    .drop-zone {
        width: var(--image-drop-width);
        height: var(--image-drop-height);
    }
</style>
