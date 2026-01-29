import QRCode from 'qrcode';

export const generateQr = async (id) => {

    try {
        return await QRCode.toDataURL(id)

    }catch(e) {
        console.log(e)
    }
}