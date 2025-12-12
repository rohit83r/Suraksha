import crypto from "crypto";
import QRCode from "qrcode";

const SECRET = process.env.DTID_SECRET || "supersecretkey";

export const generateTID = () => {
    return "TID-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

export const generateSignature = (tid: string) => {
    return crypto.createHmac("sha256", SECRET).update(tid).digest("hex");
};

export const generateQRCode = async (payload: any) => {
    return await QRCode.toDataURL(JSON.stringify(payload));
};
