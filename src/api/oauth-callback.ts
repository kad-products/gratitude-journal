import { stringifySetCookie } from 'cookie';
import type { RequestInfo } from 'rwsdk/worker';
import { getOAuthClient } from '@/lib/auth/client';

const PUBLIC_URL: string = process.env.PUBLIC_URL || 'http://127.0.0.1:5173';

export async function get({ request, response }: RequestInfo): Promise<Response> {
	try {
		const client = await getOAuthClient();

		// Exchange code for session
		const { session } = await client.callback(new URL(request.url).searchParams);

		// Set DID cookie
		response.headers.set(
			'Set-Cookie',
			stringifySetCookie({
				name: 'did',
				value: session.did,
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7, // 1 week
			}),
		);

		response.headers.set('Location', new URL('/', PUBLIC_URL).href);
		return new Response(null, { status: 302, headers: response.headers });
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: logging for this hacked PoC
		console.error('OAuth callback error:', error);
		return Response.redirect(new URL('/?error=login_failed', PUBLIC_URL), 302);
	}
}
