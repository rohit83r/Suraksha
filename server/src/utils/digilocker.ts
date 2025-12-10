import xml2js from "xml2js";

export const getDigiLockerRedirectURL = (regToken: string) => {
    const base = process.env.DL_AUTH_URL;

    return (
        `${base}?response_type=code` +
        `&client_id=${process.env.DL_CLIENT_ID}` +
        `&redirect_uri=${process.env.DL_REDIRECT_URI}` +
        `&scope=openid dg:kyc:basic` +
        `&state=${regToken}`
    );
};

export const exchangeAuthCodeForToken = async (code: string) => {
    const res = await fetch(process.env.DL_TOKEN_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.DL_REDIRECT_URI!,
            client_id: process.env.DL_CLIENT_ID!,
            client_secret: process.env.DL_CLIENT_SECRET!,
        }),
    });

    if (!res.ok) throw new Error("Token exchange failed");
    return await res.json();
};

export const fetchAadhaarXML = async (accessToken: string) => {
    const res = await fetch(process.env.DL_EKYC_URL!, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch Aadhaar XML");
    return await res.text();
};

// Parse Aadhaar XML from DigiLocker
export const parseAadhaarXML = (xml: string) => {
    let parsed: any = {};

    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) throw new Error("Invalid Aadhaar XML");

        const uidData = result.OfflinePaperlessKyc.UidData;

        parsed.realAadhaar = uidData.Poi.$.aadhaar;
        parsed.name = uidData.Poi.$.name;
        parsed.dob = uidData.Poi.$.dob;
        parsed.gender = uidData.Poi.$.gender;
        parsed.address = uidData.Poa.$;
    });

    return parsed;
};
