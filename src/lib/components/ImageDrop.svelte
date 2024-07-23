<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'
    import JumpingText from './JumpingText.svelte'

    let image: string | null = null
    let imageFile: File | null = null
    let fileInput: HTMLInputElement | null = null
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
            : 'p-4 border-2 border-dashed border-gray-500 bg-[#00000050]'} cursor-pointer rounded-lg w-[284px] h-[380px]"
        aria-dropeffect="copy"
        tabindex="0"
        aria-label="Drop image here"
        on:drop={handleImageDrop}
        on:dragover={(event) => event.preventDefault()}
        on:dragleave={(event) => event.preventDefault()}
        on:click={() => fileInput?.click()}
    >
        {#if image}
            <img src={$imageSrc} alt="Uploaded content" class="h-full preview" />
        {:else}
            <div class="text-center flex items-center h-full">
                <JumpingText className="text-xl" text="Drag and drop an image here or click to select one" />
            </div>
        {/if}
    </button>
    <input
        type="file"
        class="hidden"
        on:change={handleImageSelection}
        accept="image/*"
        bind:this={fileInput}
    />
</div>

<style>
    .preview {
        image-rendering: pixelated;
    }
</style>
