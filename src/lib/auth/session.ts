import type { OAuthSession } from '@atproto/oauth-client-node';
import { parseCookie } from 'cookie';
import { getOAuthClient } from './client';

export async function getSession(request: Request): Promise<OAuthSession | null> {
	const did = getDid(request);
	if (!did) return null;

	try {
		const client = await getOAuthClient();
		return await client.restore(did);
	} catch {
		return null;
	}
}

export function getDid(request: Request): string | null {
	const cookieHeader = request.headers.get('cookie');
	if (!cookieHeader) return null;
	return parseCookie(cookieHeader).did ?? null;
}
