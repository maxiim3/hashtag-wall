import { Feed } from '$lib/models/post.response';
import { client } from '$lib/server/bluesky/sdk';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const text = data.get('search') as string;

		const resp = await client.searchByTags({
			limit: 100,
			sort: 'top',
			q: text
		});

		const feed = new Feed(resp.data.posts);

		return {
			tags: feed.tags,
			search: text
		};
	}
};
