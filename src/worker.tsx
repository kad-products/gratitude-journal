import { pages } from '@kad-products/shed/rwsdk/server';
import { except, render, route } from 'rwsdk/router';
import { type DefaultAppContext, defineApp, type RequestInfo } from 'rwsdk/worker';
import AppDocument from '@/documents/app';
import Pages__root from '@/pages/root';
import { get as oauthCallbackGet } from './api/oauth-callback';
import { get as oauthClientMetadata } from './api/oauth-client-metadata';
import { post as oauthLoginPost } from './api/oauth-login';
import { post as oauthLogoutPost } from './api/oauth-logout';

import Pages__not_found from './pages/not-found';

export default defineApp(
	[
		render(AppDocument, [
			except<RequestInfo<DefaultAppContext>>(pages.handlePageError),
			route('/', Pages__root),
			route('/oauth/login', { post: oauthLoginPost }),
			route('/oauth/logout', { post: oauthLogoutPost }),
			route('/oauth/callback', { get: oauthCallbackGet }),
			route('/oauth-client-metadata.json', { get: oauthClientMetadata }),
			route('*', Pages__not_found),
		]),
	],
	{
		// Allow the tunnel origin in dev so rwsdk's same-origin check passes when
		// req.url is localhost but the browser Origin header is the tunnel hostname.
		allowedOrigins: ['127.0.0.1'],
	},
);
