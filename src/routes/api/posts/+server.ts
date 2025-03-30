import { agent } from '$lib/server/bluesky';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const body = await request.json();
	const { data } = await agent.app.bsky.feed.searchPosts(body);
	return json(data);
};
