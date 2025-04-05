import { error } from '@sveltejs/kit';
import type { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { env } from '$env/dynamic/private';
import { buildURI } from '$lib/utils/buildURI';

type APIError = {
	error: string;
	message: string;
};

type APISuccess = {
	posts: PostView[];
	cursor: number;
};

if (!env.BASE_URL) throw new Error('Bluesky base url is not set');

export async function fetchSearchPosts(queryParams: APIQueryModel) {
	const queries = buildURI<APIQueryModel>(queryParams);
	const params = queries.join('&');
	const url = `${env.BASE_URL}?${params}`;
	const results = await fetch(url);

	const data: APISuccess | APIError = await results.json();

	if (!results.ok) error(results.status, (data as APIError).message);

	return { results: data as APISuccess };
}
