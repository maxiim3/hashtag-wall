import type { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

interface BuildPostUS {
	/**@private */
	_extractTags(record: Record<string, unknown>): void;
}

export class BuildPost implements BuildPostUS {
	id: string;
	author: string;
	text: string;
	replyCount?: number;
	repostCount?: number;
	likeCount?: number;
	quoteCount?: number;
	indexedAt: string;
	tags: Set<string>;

	constructor(props: Partial<PostView>) {
		this.id = props.uri!;
		this.author = props.author?.displayName || '';
		this.text = String(props.record?.text) || '';
		this.replyCount = props.replyCount;
		this.repostCount = props.repostCount;
		this.likeCount = props.likeCount;
		this.quoteCount = props.quoteCount;
		this.indexedAt = props.indexedAt!;
		this.tags = new Set();

		// init tags
		if (!props.record) return;
		this._extractTags(props.record);
	}

	_extractTags(record: Record<string, unknown>): void {
		if (!record.facets) return;

		const facets = record.facets as Record<string, unknown>[];
		for (const facet of facets) {
			if (!facet.features) continue;

			const features = facet.features as Record<string, unknown>[];

			for (const feature of features) {
				if (!feature.tag) continue;

				const tag = feature.tag as string;

				this.tags.add(tag);
			}
		}
	}
}

export interface TagStat extends Record<string, number | string> {
	like: number;
	repost: number;
	quote: number;
	count: number;
	reply: number;
	name: string;
}

export class Feed {
	private _postBuffer: Map<string, BuildPost>;
	private _tagBuffer: Map<string, TagStat>;
	public posts: BuildPost[];
	public tags: TagStat[];

	constructor(res: PostView[]) {
		this._postBuffer = new Map();
		this._tagBuffer = new Map();

		for (const postRepsonse of res) {
			const post = new BuildPost(postRepsonse);

			// If post Id already treated... remove duplicata
			if (this._postBuffer.has(post.id)) continue;

			// otherwise add post
			this._postBuffer.set(post.id, post);

			// check if post has tags
			if (!post.tags.size) continue;

			console.log('has tag');
			// loop over tags to set stats for each
			for (const tag of post.tags.values()) {
				const normalizedTag = this.normalizeTag(tag);
				if (this._tagBuffer.has(normalizedTag)) {
					// IF tag already set we update it
					const saveStat = this._tagBuffer.get(normalizedTag)!;
					this._tagBuffer.set(normalizedTag, {
						count: saveStat.count + 1,
						like: saveStat.like + post.likeCount!,
						quote: saveStat.quote + post.quoteCount!,
						repost: saveStat.repost + post.repostCount!,
						reply: saveStat.reply + post.replyCount!,
						name: normalizedTag
					});
				} else {
					// ELSE Add a new tag
					this._tagBuffer.set(tag, {
						count: 1,
						like: post.likeCount!,
						quote: post.quoteCount!,
						repost: post.repostCount!,
						reply: post.replyCount!,
						name: tag
					});
				}
			}
		}

		this.posts = Array.from(this._postBuffer.values());
		console.log(this.posts[2]);
		this.tags = Array.from(this._tagBuffer.values());
	}

	private normalizeTag(tag: string) {
		return tag.toLowerCase().trim().replaceAll(',', '').replaceAll('.', '');
	}
}
