<script lang="ts">
	import { Feed, type TagStat } from '$lib/models/post.response';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { form }: PageProps = $props();

	let search = $state();
	let sortLabel = $state<keyof TagStat>('count');

	let searchIdl = $derived(form && form.search);
	let feed = $derived(new Feed(form?.results || []));
	let count = $derived(feed.posts.length || 0);
	let sortedFeed = $derived(
		feed.tagStatistic().sort((a: TagStat, b: TagStat) => (a[sortLabel] - b[sortLabel]) * -1)
	);

	function handleSort(label: keyof TagStat) {
		sortLabel = label;
	}

	function resetSearch(ev: Event) {
		ev.preventDefault();
		form = null;
	}
</script>

<main class="flex flex-col items-center gap-8 p-1 sm:p-4">
	<h1 class="mt-12 text-xl font-bold">Bluesky Hashtag wall</h1>
	<section>
		<form method="POST" use:enhance>
			<input name="search" bind:value={search} required placeholder="#trending-tag" />
			<p class="pl-2 text-sm text-slate-500 italic">Look for a specific hashtag</p>
			<div class="flex flex-col items-center gap-2">
				<p>Search for <bold class="font-bold">{form?.search || search}</bold></p>
				<p>results: <bold class="font-bold">{count}</bold></p>
				<button type="reset" class=" rounded-sm border p-1" onclick={resetSearch}>reset</button>
			</div>
		</form>
	</section>

	{#if searchIdl}
		{@const styles = 'flex w-full gap-4 items-center px-2'}
		<!-- Result table -->
		{#key feed}
			<ul class="w-2/3" class:mt-3={searchIdl}>
				<li class={[styles, 'top-0 bg-white/20 py-2 backdrop-blur-sm']}>
					{@render sortButton('NAME', 'name', 'text-black', true)}
					{@render sortButton('COUNT', 'count', 'text-blue-700')}
					{@render sortButton('LIKE', 'like', 'text-pink-700')}
					{@render sortButton('REPLLY', 'reply', 'text-blue-900 uppercase')}
					{@render sortButton('REPOST', 'repost', 'text-lime-900 uppercase')}
					{@render sortButton('QUOTE', 'quote', 'text-slate-900 uppercase')}
				</li>
				{#each sortedFeed as tag (tag.name)}
					<li class={[styles]}>
						{@render tagStatLine(tag)}
					</li>
				{:else}
					<li>Nothing there...</li>
				{/each}
			</ul>
		{/key}

		<!-- <h2>Posts</h2>
		{#each feed.posts as post (post.id)}
			<p>{post.id}</p>
		{/each} -->
	{/if}
</main>

{#snippet sortButton(label: string, colKey: keyof TagStat, styles: string, wide?: boolean)}
	<button
		class={['flex-1 cursor-pointer text-left text-sm font-bold', styles]}
		class:underline={label === sortLabel}
		class:underline-offset-2={label === sortLabel}
		class:max-w-44={wide}
		class:max-w-12={!wide}
		class:grow={wide}
		onclick={() => handleSort(colKey)}
	>
		{label}
	</button>
{/snippet}

<!-- SNIPPER LINE -->
{#snippet tagStatLine(tag: TagStat)}
	<span class="max-w-44 flex-1 grow text-sm font-bold underline underline-offset-2">{tag.name}</span
	>
	<span class="max-w-12 flex-1 text-sm font-bold text-blue-700">{tag.count}</span>
	<span class="max-w-12 flex-1 text-sm text-pink-600">{tag.like}</span>
	<span class="max-w-12 flex-1 text-sm">{tag.repost}</span>
	<span class="max-w-12 flex-1 text-sm">{tag.reply}</span>
	<span class="max-w-12 flex-1 text-sm">{tag.quote}</span>
{/snippet}
