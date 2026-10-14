import { getOAuthClient } from '@/lib/auth/client';

// The URL of this endpoint IS your client_id
// Authorization servers fetch this to learn about your app

export async function get(): Promise<Response> {
	const client = await getOAuthClient();
	return Response.json(client.clientMetadata);
}
