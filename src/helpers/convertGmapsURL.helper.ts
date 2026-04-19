import axios from "axios";

export async function convertGmapsUrl(url: string) {
    try {
        const res = await axios.get(url, {
            maxRedirects: 5
        });

        const finalUrl = res.request.res.responseUrl;

        const placeMatch = finalUrl.match(/place\/([^/]+)/);
        if (placeMatch) {
            const place = decodeURIComponent(placeMatch[1]);
            
            return `https://www.google.com/maps?q=${place}&z=15&output=embed`;
        }

        const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+),(\d+(\.\d+)?)z/);
        if (match) {
            const lat = match[1];
            const lng = match[2];
            const zoom = Math.round(parseFloat(match[3]));

            return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
        }

        return null;
    } catch (err) {
        return null;
    }
}