import { fromShareCode, stripFormatting, type VoucherData } from '$lib';

export const prerender = false;

export function load({ url }) {
    let voucherObj: VoucherData | null = null

    const code = url.searchParams.get('code')
    if (code !== null) {
        voucherObj = fromShareCode(decodeURIComponent(code))
    }

    if (voucherObj === null) {
        return {
            consumableData: null
        };
    }

    return {
        voucherData: voucherObj,
        title: `Voucher - ${voucherObj?.locName}`,
        description: stripFormatting(voucherObj?.locText ?? '')
    };
}