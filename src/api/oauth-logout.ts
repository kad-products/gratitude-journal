import { parseCookie, stringifySetCookie } from 'cookie';
import type { RequestInfo } from 'rwsdk/worker';
import { getOAuthClient } from '@/lib/auth/client';

const clearDidCookie = stringifySetCookie({
	name: 'did',
	value: '',
	path: '/',
	httpOnly: true,
	maxAge: 0,
});

export async function post({ request }: RequestInfo): Promise<Response> {
	const cookies = parseCookie(request.headers.get('Cookie') ?? '');
	const did = cookies.did;

	try {
		if (did) {
			const client = await getOAuthClient();
			await client.revoke(did);
		}

		return Response.json({ success: true }, { headers: { 'Set-Cookie': clearDidCookie } });
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: logging for this hacked PoC
		console.error('Logout error:', error);
		return Response.json({ success: true }, { headers: { 'Set-Cookie': clearDidCookie } });
	}
}
