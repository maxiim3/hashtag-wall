import { client } from '$lib/server/bluesky/sdk';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const resp = await client.login();
	return {
		connected: resp.success,
		username: resp.data.handle
	};
};
