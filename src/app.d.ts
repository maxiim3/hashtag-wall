// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {}
	export interface APIQueryModel extends AppBskyFeedSearchPosts.QueryParams {
		sort: 'latest' | 'top';
		q: string;
	}
}

export {};
