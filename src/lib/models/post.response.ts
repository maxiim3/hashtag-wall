import type { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

export class BuildPost {
	id: string;
	author: string;
	text: string;
	replyCount?: number;
	repostCount?: number;
	likeCount?: number;
	quoteCount?: number;
	indexedAt: string;

	constructor(props: Partial<PostView>) {
		this.id = props.cid!;
		this.author = props.author?.displayName || '';
		this.text = String(props.record?.text) || '';
		this.replyCount = props.replyCount;
		this.repostCount = props.repostCount;
		this.likeCount = props.likeCount;
		this.quoteCount = props.quoteCount;
		this.indexedAt = props.indexedAt!;
	}
}

export class Feed {
	tags: Set<string> = new Set();
	countTags: Map<string, number> = new Map();
	tagRgx = /(#).+?(\s|$)/gs;
	posts: BuildPost[];

	constructor(res: PostView[]) {
		this.posts = res.map((r) => new BuildPost(r));
		this.extractTags();
		this._countTags();
	}

	countLikes = () => {
		this.posts.reduce((acc, post) => (post.likeCount || 0) + acc, 0);
	};

	countReply = () => {
		this.posts.reduce((acc, post) => (post.replyCount || 0) + acc, 0);
	};

	countRepost = () => {
		this.posts.reduce((acc, post) => (post.repostCount || 0) + acc, 0);
	};

	private extractTags = () => {
		this.posts.forEach((p) => {
			const match = p.text.match(this.tagRgx);
			match?.forEach((m) => this.tags.add(m.toLowerCase()));
		});
	};

	private _countTags = () => {
		this.posts.forEach((p) => {
			const match = p.text.match(this.tagRgx);
			match?.forEach((m) => {
				const tag = m.toLowerCase().split('#')[1].trim();
				if (this.countTags.has(tag)) {
					const count = this.countTags.get(tag)!;
					this.countTags.set(tag, count + 1);
				} else {
					this.countTags.set(tag, 1);
				}
			});
		});
	};
}
