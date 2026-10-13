import { cloudflare } from '@cloudflare/vite-plugin';
import { redwood } from 'rwsdk/vite';
import type { Plugin } from 'vite';
import { defineConfig, loadEnv } from 'vite';

// Cloudflare Workers (workerd) rejects `redirect: "error"` in both the fetch()
// call and the Request() constructor.  The @atproto-labs family of packages uses
// this option pervasively to catch unexpected redirects.  Since neither the
// devnet services nor production ATProto infrastructure redirects DID/handle
// lookups, converting to "follow" is safe and is the recommended workaround.
function patchAtprotoRedirectError(): Plugin {
	return {
		name: 'patch-atproto-redirect-error',
		transform(code: string, id: string): string | undefined {
			if (id.includes('@atproto') || id.includes('atproto-labs') || id.includes('atproto_oauth-client-node')) {
				return code.replace(/redirect:\s*['"]error['"]/g, "redirect: 'follow'");
			}
		},
	};
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const tunnelHost = env.VITE_BASE_URL ? new URL(env.VITE_BASE_URL).host : null;

	return {
		css: {
			modules: {
				localsConvention: 'camelCase',
			},
		},
		plugins: [
			patchAtprotoRedirectError(),
			cloudflare({
				viteEnvironment: { name: 'worker' },
			}),
			redwood(),
		],
		server: {
			...(tunnelHost && {
				cors: false,
				allowedHosts: [tunnelHost],
				hmr: {
					host: tunnelHost,
					protocol: 'wss',
				},
			}),
		},
	};
});
