<script>
    import VoucherEditor from "$lib/components/VoucherEditor.svelte"

    export let data
</script>
<VoucherEditor initialVoucherData={data.voucherData} />