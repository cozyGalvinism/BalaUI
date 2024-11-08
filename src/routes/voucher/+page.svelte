<script>
    import { VoucherEditor } from "$lib/components"

    let { data } = $props();
</script>
<VoucherEditor initialVoucherData={data.voucherData} />