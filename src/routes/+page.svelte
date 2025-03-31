<script lang="ts">
	import { Feed, type TagStat } from '$lib/models/post.response';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	const { form }: PageProps = $props();
	let feed = $derived(new Feed(form?.results || []));
	let count = $derived(feed.posts.length || 0);
	let search = $state();
	$effect(() => {
		console.log('rerender', feed.countTags);
	});

	let sortLabel = $state<keyof TagStat>('name');
	let sortValue = $state<0 | 1 | -1>(0);

	function handleSort(label: keyof TagStat) {
		sortLabel = label;

		if (sortValue === 1) sortValue = -1;
		else if (sortValue === -1) sortValue = 0;
		else sortValue = 1;
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form method="POST" use:enhance>
	<input name="search" bind:value={search} required />
</form>

<p>Search for {form?.search || search}</p>
{#if feed}
	<div class="flex flex-col gap-12 p-4">
		<h2>RESULTS: {count}</h2>

		<h2>Tags</h2>

		{#key feed}
			<ul class="flex w-full flex-col gap-3">
				<li class="sticky top-0 flex w-full gap-4 bg-white/20 py-2 backdrop-blur-sm">
					<button
						class="max-w-44 flex-1 grow cursor-pointer text-sm font-bold underline underline-offset-2"
					>
						NAME
					</button>
					<button
						onclick={() => handleSort('count')}
						class="max-w-12 flex-1 cursor-pointer text-sm font-bold text-blue-700">COUNT</button
					>
					<button
						onclick={() => handleSort('like')}
						class="max-w-12 flex-1 cursor-pointer text-sm text-pink-600">LIKE</button
					>
					<button
						onclick={() => handleSort('repost')}
						class="max-w-12 flex-1 cursor-pointer text-sm">REPOST</button
					>
					<button onclick={() => handleSort('reply')} class="max-w-12 flex-1 cursor-pointer text-sm"
						>REPLY</button
					>
					<button onclick={() => handleSort('quote')} class="max-w-12 flex-1 cursor-pointer text-sm"
						>QUOTE</button
					>
				</li>
				{#each feed
					.tagStatistic()
					.sort((a: TagStat, b: TagStat) => {
						if (sortValue === 0) return 0;
						return (a[sortLabel] - b[sortLabel]) * sortValue;
					})
					.sort() as tag (tag.name)}
					<li class="flex w-full gap-4">
						<span class="max-w-44 flex-1 grow text-sm font-bold underline underline-offset-2"
							>{tag.name}</span
						>
						<span class="max-w-12 flex-1 text-sm font-bold text-blue-700">{tag.count}</span>
						<span class="max-w-12 flex-1 text-sm text-pink-600">{tag.like}</span>
						<span class="max-w-12 flex-1 text-sm">{tag.repost}</span>
						<span class="max-w-12 flex-1 text-sm">{tag.reply}</span>
						<span class="max-w-12 flex-1 text-sm">{tag.quote}</span>
					</li>
				{:else}
					<li>Nothing there...</li>
				{/each}
			</ul>
		{/key}

		<h2>Posts</h2>
		{#each feed.posts as post (post.id)}
			<p>{post.id}</p>
		{/each}
	</div>
{/if}
