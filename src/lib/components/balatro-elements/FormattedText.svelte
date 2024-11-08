<script lang="ts">
    import { onMount } from 'svelte'

    interface Props {
        text?: string;
    }

    let { text = '' }: Props = $props();

    interface FormatOptions {
        color?: string
        backgroundColor?: string
        padding?: string
        lineHeight?: string
        borderRadius?: string
        fontSize?: string
        animation?: string
    }

    //   G.ARGS.LOC_COLOURS = G.ARGS.LOC_COLOURS or {
    //   red = G.C.RED,
    //   mult = G.C.MULT,
    //   blue = G.C.BLUE,
    //   chips = G.C.CHIPS,
    //   green = G.C.GREEN,
    //   money = G.C.MONEY,
    //   gold = G.C.GOLD,
    //   attention = G.C.FILTER,
    //   purple = G.C.PURPLE,
    //   white = G.C.WHITE,
    //   inactive = G.C.UI.TEXT_INACTIVE,
    //   spades = G.C.SUITS.Spades,
    //   hearts = G.C.SUITS.Hearts,
    //   clubs = G.C.SUITS.Clubs,
    //   diamonds = G.C.SUITS.Diamonds,
    //   tarot = G.C.SECONDARY_SET.Tarot,
    //   planet = G.C.SECONDARY_SET.Planet,
    //   spectral = G.C.SECONDARY_SET.Spectral,
    //   edition = G.C.EDITION,
    //   dark_edition = G.C.DARK_EDITION,
    //   legendary = G.C.RARITY[4],
    //   enhanced = G.C.SECONDARY_SET.Enhanced
    // }

    // Define a map of custom formats to their corresponding styles
    const formatMap: Record<string, string> = {
        RED: '#fe5f55',
        MULT: '#fe5f55',
        BLUE: '#009dff',
        CHIPS: '#009dff',
        GREEN: '#4BC292',
        MONEY: '#f3b958',
        GOLD: '#eac058',
        ATTENTION: '#ff9a00',
        PURPLE: '#8867a5',
        WHITE: '#ffffff',
        INACTIVE: '#88888899',
        SPADES: '#403995',
        HEARTS: '#f03464',
        CLUBS: '#235955',
        DIAMONDS: '#f06b3f',
        TAROT: '#a782d1',
        PLANET: '#13afce',
        SPECTRAL: '#4584fa',
        EDITION: '<edition>',
        DARK_EDITION: '<dark_edition>',
        LEGENDARY: '#b26cbb',
        ENHANCED: '#8389DDFF',
    }

    type TextPart =
        | { type: 'text'; content: string }
        | { type: 'formatted'; content: string; format: FormatOptions }

    // Function to parse the custom formatted text
    function parseText(text: string): TextPart[] {
        // const regex =
        //     /{C:(.*?)}([\s\S]*?)(?={C:|{}|$)|({})([\s\S]*?)(?={C:|{}|$)/g
        const regex =
            /(\s*){([^}]*)}([\s\S]*?)(?={|$)|(\s*)({})([\s\S]*?)(?={|$)/g
        let match: RegExpExecArray | null
        const parts: TextPart[] = []
        let lastIndex = 0

        while ((match = regex.exec(text)) !== null) {
            const leadingSpaces = match[1] || match[4] || ''
            const formatOptions: FormatOptions = {}
            const formatString = match[2]
            const content = match[3] || match[6]

            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.slice(lastIndex, match.index),
                })
            }

            // Split the format string by comma and process each option
            if (formatString) {
                formatString.split(',').forEach((option) => {
                    const [key, value] = option.split(':')
                    if (key && value) {
                        // check if value is in formatMap
                        if (key === 'C') {
                            if (!formatMap[value.toUpperCase()]) return
                            const color = formatMap[value.toUpperCase()]
                            if (color === '<edition>') {
                                formatOptions.animation = 'edition'
                            } else if (color === '<dark_edition>') {
                                formatOptions.animation = 'dark-edition'
                            } else {
                                formatOptions.color = color
                            }
                        }

                        if (key === 'X') {
                            if (!formatMap[value.toUpperCase()]) return
                            const color = formatMap[value.toUpperCase()]
                            formatOptions.padding = '1px'
                            formatOptions.lineHeight = '0.8'
                            formatOptions.borderRadius = '0.1rem'

                            if (color === '<edition>') {
                                formatOptions.animation = 'edition-bg'
                            } else if (color === '<dark_edition>') {
                                formatOptions.animation = 'dark-edition-bg'
                            } else {
                                formatOptions.backgroundColor = color
                            }
                        }

                        if (key === 's')
                            formatOptions.fontSize =
                                Number.parseFloat(value) * 24 + 'px'
                    }
                })

                parts.push({ type: 'text', content: leadingSpaces })
                parts.push({
                    type: 'formatted',
                    content,
                    format: formatOptions,
                })
            } else {
                parts.push({ type: 'text', content })
            }

            lastIndex = regex.lastIndex
        }

        // Push any remaining text after the last match
        if (lastIndex < text.length) {
            parts.push({ type: 'text', content: text.slice(lastIndex) })
        }

        return parts
    }

    let parsedText: TextPart[] = $derived(parseText(text))
    

    function renderContent(content: string) {
        if (!content) return ''
        return content
            .split('\n')
            .map((line) =>
                line
                    .split(' ')
                    .map((word, index, array) =>
                        index < array.length - 1 ? `${word}&nbsp;` : word
                    )
                    .join('')
            )
            .flatMap((line, index, array) =>
                index < array.length - 1 ? [line, '<br>'] : [line]
            )
            .join('')
    }

    // self.C.DARK_EDITION[1] = 0.6+0.2*math.sin(self.TIMERS.REAL*1.3)
    // self.C.DARK_EDITION[3] = 0.6+0.2*(1- math.sin(self.TIMERS.REAL*1.3))
    // self.C.DARK_EDITION[2] = math.min(self.C.DARK_EDITION[3], self.C.DARK_EDITION[1])

    // self.C.EDITION[1] = 0.7+0.2*(1+math.sin(self.TIMERS.REAL*1.5 + 0))
    // self.C.EDITION[3] = 0.7+0.2*(1+math.sin(self.TIMERS.REAL*1.5 + 3))
    // self.C.EDITION[2] = 0.7+0.2*(1+math.sin(self.TIMERS.REAL*1.5 + 6))
</script>

<span>
    {#each parsedText as part}
        {#if part.type === 'text'}
            {@html renderContent(part.content)}
        {:else if part.type === 'formatted'}
            <span
                class="formatted {part.format.animation
                    ? part.format.animation
                    : 'static-color'}"
                style="
            {part.format.animation
                    ? ''
                    : `--color: ${part.format.color}; 
            --background-color: ${part.format.backgroundColor || 'transparent'}; `}
            --font-size: {part.format.fontSize || 'inherit'};
            --line-height: {part.format.lineHeight || 'normal'};
            --padding: {part.format.padding || '0'};
            --border-radius: {part.format.borderRadius || '0'}
          "
            >
                {@html renderContent(part.content)}
            </span>
        {/if}
    {/each}
</span>

<style>
    .static-color {
        color: var(--color);
        background-color: var(--background-color);
    }

    .edition {
        animation: edition 1s linear infinite;
    }

    .edition-bg {
        animation: edition-bg 1s linear infinite;
    }

    .dark-edition {
        animation: dark-edition 1s linear infinite;
    }

    .dark-edition-bg {
        animation: dark-edition-bg 1s linear infinite;
    }

    .formatted {
        display: inline-block;
        padding: var(--padding);
        line-height: var(--line-height);
        border-radius: var(--border-radius);
        font-size: var(--font-size);
    }

    @keyframes dark-edition {
        0% {
            color: rgb(153, 153, 204);
        }
        25% {
            color: rgb(194, 179, 163);
        }
        50% {
            color: rgb(204, 204, 153);
        }
        75% {
            color: rgb(163, 179, 194);
        }
        100% {
            color: rgb(153, 153, 204);
        }
    }

    @keyframes dark-edition-bg {
        0% {
            background-color: rgb(153, 153, 204);
        }
        25% {
            background-color: rgb(194, 179, 163);
        }
        50% {
            background-color: rgb(204, 204, 153);
        }
        75% {
            background-color: rgb(163, 179, 194);
        }
        100% {
            background-color: rgb(153, 153, 204);
        }
    }

    @keyframes edition-bg {
        0% {
            background-color: rgb(179, 230, 230);
        }
        25% {
            background-color: rgb(214, 194, 235);
        }
        50% {
            background-color: rgb(230, 179, 230);
        }
        75% {
            background-color: rgb(194, 235, 194);
        }
        100% {
            background-color: rgb(179, 230, 230);
        }
    }

    @keyframes edition {
        0% {
            color: rgb(179, 230, 230);
        }
        25% {
            color: rgb(214, 194, 235);
        }
        50% {
            color: rgb(230, 179, 230);
        }
        75% {
            color: rgb(194, 235, 194);
        }
        100% {
            color: rgb(179, 230, 230);
        }
    }
</style>
