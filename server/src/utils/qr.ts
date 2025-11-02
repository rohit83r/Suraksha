import QRCode from 'qrcode';


export async function generateQrDataURL(text: string) {
    return QRCode.toDataURL(text);
}