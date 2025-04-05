import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type {
	AppBskyFeedGetPosts,
	AppBskyFeedSearchPosts,
	ComAtprotoServerCreateSession
} from '@atproto/api/dist/client';
import { AtpAgent } from '@atproto/api';

if (!env.BS_ID) throw new Error('LOGIN is not set');
if (!dev && !env.BS_PASSWORD) throw new Error('PASSWORD is not set');

/**
 * @class
 * @private
 */
interface ClientUS {
	searchByTags(query: APIQueryModel): Promise<AppBskyFeedGetPosts.Response>;
	login(): Promise<ComAtprotoServerCreateSession.Response>;
}

export class Client implements ClientUS {
	private sdk: AtpAgent;

	constructor() {
		this.sdk = new AtpAgent({
			service: 'https://bsky.social'
		});
	}

	public async searchByTags(
		query: AppBskyFeedSearchPosts.QueryParams
	): Promise<AppBskyFeedGetPosts.Response> {
		return await this.sdk.app.bsky.feed.searchPosts(query);
	}

	public async login() {
		const connection = await this.sdk.login({
			identifier: env.BS_ID,
			password: env.BS_PASSWORD
		});

		console.log(connection.data);
		return connection;
	}
}

/** @public */
export const client = new Client();
