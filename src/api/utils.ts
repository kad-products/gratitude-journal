import { env } from 'cloudflare:workers';

export function apiErrorResponse(err: unknown, fallbackMessage: string = 'An error occurred'): Response {
	const status = 500;
	if (env.KAD_PRODUCTS_ENVIRONMENT === 'production') {
		return Response.json({ success: false, error: fallbackMessage }, { status });
	}
	if (err instanceof Error) {
		return Response.json(
			{
				success: false,
				error: err.message,
				...(err.cause !== undefined ? { cause: serializeCause(err.cause) } : {}),
			},
			{ status },
		);
	}
	return Response.json({ success: false, error: 'An unexpected error occurred' }, { status });
}

function serializeCause(cause: unknown): unknown {
	if (cause instanceof Error) {
		return {
			name: cause.name,
			message: cause.message,
			...(cause.cause !== undefined ? { cause: serializeCause(cause.cause) } : {}),
		};
	}
	return cause;
}

export function errorResponse(error: string, status: number = 400): Response {
	return Response.json({ success: false, error }, { status });
}

export function successResponse<T>(data: T, status: number = 200): Response {
	return Response.json({ success: true, data }, { status });
}
