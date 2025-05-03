import FormData from 'form-data';
import fetch from 'node-fetch';

export async function uploadImageToCloudflare(imageUrl: string): Promise<string> {
    const form = new FormData();

    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from ${imageUrl}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';

    form.append('file', response.body as any, {
        filename: 'image.jpg',
        contentType,
    });

    const uploadRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            },
            body: form,
        }
    );

    const json = await uploadRes.json();

    if (!json.success) {
        throw new Error(`Failed to upload image to Cloudflare: ${JSON.stringify(json.errors)}`);
    }

    return json.result.variants[0];
}
