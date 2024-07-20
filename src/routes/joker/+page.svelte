<script>
    import CardDescription from "$lib/components/CardDescription.svelte";
    import JokerEditor from "$lib/components/JokerEditor.svelte"

    let joker = {
        name: "Fibonacci",
        description: "Each played {C:attention}Ace{},\n{C:attention}2{}, {C:attention}3{}, {C:attention}5{}, or {C:attention}8{} gives\n{C:mult}+8{} Mult when scored",
        rarity: 2
    };
</script>

<!-- <CardDescription name={joker.name} description={joker.description} rarity={joker.rarity} /> -->

<div class="mt-4">
    <JokerEditor />
</div>