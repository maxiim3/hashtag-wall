import { error } from '@sveltejs/kit';
import type { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import type { Actions } from './$types';

const BASE_URL = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts';

function buildQSP(params: Record<string, string>) {
	return Object.entries(params).map(([key, value]) => {
		return `${key}=${encodeURIComponent(value)}`;
	});
}

type APIError = {
	error: string;
	message: string;
};

type APISuccess = {
	posts: PostView[];
	cursor: number;
};

async function fetchSearchPosts(q: Record<string, string>) {
	const queries = buildQSP(q);
	const params = queries.join('&');
	const url = `${BASE_URL}?${params}`;
	const results = await fetch(url);

	const data: APISuccess | APIError = await results.json();

	if (!results.ok) error(results.status, (data as APIError).message);

	return { results: data as APISuccess };
}

export const actions: Actions = {
	default: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const query = {
			limit: '100',
			sort: 'top',
			q: data.get('search') as string
		};
		const { results } = await fetchSearchPosts(query);
		console.log('action', results);

		return { results: results.posts };
	}
};
