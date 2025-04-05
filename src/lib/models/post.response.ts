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
		this.id = props.uri!;
		this.author = props.author?.displayName || '';
		this.text = String(props.record?.text) || '';
		this.replyCount = props.replyCount;
		this.repostCount = props.repostCount;
		this.likeCount = props.likeCount;
		this.quoteCount = props.quoteCount;
		this.indexedAt = props.indexedAt!;
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
	tags: Set<string> = new Set();
	countTags: Map<string, number> = new Map();
	tagRgx = /(#).+?(\s|$)/gs;
	posts: BuildPost[];
	private tagStat: Map<string, TagStat> = new Map();

	constructor(res: PostView[]) {
		this.posts = res.map((r) => new BuildPost(r));
		this._keepUniqPosts();
		this._tagStats();
		this.extractTags();
		this._countTags();
	}

	private _keepUniqPosts() {
		const s = new Map<string, BuildPost>();

		this.posts.forEach((p) => {
			if (s.has(p.id)) return;
			s.set(p.id, p);
		});
		this.posts = Array.from(s.values());
	}

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

	private _tagStats = () => {
		for (const post of this.posts) {
			const tags = post.text.match(this.tagRgx)!;
			tags?.forEach((_tag) => {
				const tag = _tag.toLowerCase().trim().replaceAll(',', '').replaceAll('.', '');
				if (this.tagStat.has(tag)) {
					const saveStat = this.tagStat.get(tag)!;
					this.tagStat.set(tag, {
						count: saveStat.count + 1,
						like: saveStat.like + post.likeCount!,
						quote: saveStat.quote + post.quoteCount!,
						repost: saveStat.repost + post.repostCount!,
						reply: saveStat.reply + post.replyCount!,
						name: tag
					});
				} else {
					this.tagStat.set(tag, {
						count: 1,
						like: post.likeCount!,
						quote: post.quoteCount!,
						repost: post.repostCount!,
						reply: post.replyCount!,
						name: tag
					});
				}
			});
		}
	};

	tagStatistic() {
		return Array.from(this.tagStat.values());
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
}
