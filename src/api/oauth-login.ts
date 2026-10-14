import { env } from 'cloudflare:workers';
import type { RequestInfo } from 'rwsdk/worker';
import { getOAuthClient, SCOPE } from '@/lib/auth/client';
import { apiErrorResponse, successResponse } from './utils';

type OAuthInitRequest = {
	handle?: string;
};

export type OAuthInitResponse = {
	redirectUrl?: string;
	error?: string;
};

export async function post({ request }: RequestInfo): Promise<Response> {
	try {
		const requestBody = (await request.json()) as OAuthInitRequest;

		if (!requestBody?.handle || typeof requestBody.handle !== 'string') {
			return apiErrorResponse('Handle is required');
		}

		const handle = requestBody.handle;

		const client = await getOAuthClient();

		// Resolves handle, finds their auth server, returns authorization URL
		const authUrl = await client.authorize(handle, {
			scope: SCOPE,
		});

		// In devnet, the authorization URL uses the canonical PDS URL (e.g. https://devnet.test)
		// which the user's browser can't reach. Rewrite it to the host-accessible URL instead.
		const { ATPROTO_PDS_CANONICAL_URL: canonicalUrl, ATPROTO_PDS_BROWSER_URL: browserUrl } = env;
		let redirectUrl = authUrl.toString();
		if (canonicalUrl && browserUrl) {
			redirectUrl = redirectUrl.replace(canonicalUrl, browserUrl);
		}

		return successResponse<OAuthInitResponse>({ redirectUrl });
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: temp debug logging
		console.error('OAuth login error:', error);
		return apiErrorResponse(error, 'Login failed');
	}
}
