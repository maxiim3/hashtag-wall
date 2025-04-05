<script lang="ts">
	import { Feed, type TagStat } from '$lib/models/post.response';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { sortResponseBy } from '$lib/us/sortResponseBy.us';

	let { form, data }: PageProps = $props();

	let search = $state();
	let sortLabel = $state<keyof TagStat>('count');

	let searchIdl = $derived(form && form.search);
	let tags = $derived(form?.tags || []);
	let count = $derived(tags.length || 0);
	let sortedFeed = $derived(sortResponseBy<TagStat>(tags, sortLabel));

	function handleSort(label: keyof TagStat) {
		sortLabel = label;
	}

	function resetSearch(ev: Event) {
		ev.preventDefault();
		form = null;
	}
</script>

<main class="mx-auto flex min-h-lvh max-w-[500px] flex-col items-center gap-2 border-x">
	<header class="relative">
		<img src="https://placehold.co/600x400" alt="placeholder" />
		<div class="flex h-16 items-center justify-end border-b border-black/20 p-2">
			<img
				class="absolute bottom-2 left-2 w-32 rounded-full border-4 border-white"
				src="https://avatar.iran.liara.run/public/3"
				alt="placeholder avatar"
			/>
			<h2 class="text-xl font-light">{`@${data.username}`}</h2>
		</div>
	</header>

	<section class="prose text-center">
		<h1 class="text-xl font-bold">Better Post</h1>
		<p>Optimise your reach</p>
	</section>

	<section class="my-12">
		<p class="prose p-2 text-center text-sm text-slate-500 italic">
			Enter a few keywords and get <br /> the most used hashtags.
		</p>
		<form class="flex flex-col items-center gap-2" method="POST" use:enhance>
			<input
				bind:value={search}
				class="rounded-[50px] border-black/20 placeholder:text-sm"
				name="search"
				required
				placeholder="Enter a context"
			/>
			<div class="flex flex-col items-center gap-2">
				<p>results: <bold class="font-bold">{count}</bold></p>
				<button type="reset" class=" rounded-sm border p-1" onclick={resetSearch}>reset</button>
			</div>
		</form>
	</section>

	{#if searchIdl}
		<p>
			for <code class="rounded-xl bg-slate-200 px-2 py-0.5 font-mono text-sm">{searchIdl}</code>,
			the most used tags are
		</p>
		{@const styles = 'flex w-full gap-4 items-center px-2'}
		<!-- Result table -->
		{#key sortLabel}
			<ul class="w-full" class:mt-3={searchIdl}>
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
					<li class="flex w-full rounded-full border px-2 py-1">
						<span class="flex gap-2"><span class="icon-name text-sm"></span>{tag.name}</span>
						<span class="flex gap-2"><span class="icon-count text-sm"></span>{tag.count}</span>
						<span class="flex gap-2"><span class="icon-like text-sm"></span>{tag.like}</span>
						<span class="flex gap-2"><span class="icon-repost text-sm"></span>{tag.repost}</span>
						<span class="flex gap-2"><span class="icon-reply text-sm"></span>{tag.reply}</span>
						<span class="flex gap-2"><span class="icon-quote text-sm"></span>{tag.quote}</span>
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
		aria-labelledby={label}
		title={label}
	>
		<span class={`icon-${colKey}`}></span>
	</button>
{/snippet}

<!-- SNIPPER LINE -->
{#snippet tagStatLine(tag: TagStat)}
	<span class="max-w-50 flex-1 grow text-sm font-bold">{tag.name}</span>
	<span class="max-w-12 flex-1 text-sm font-bold text-blue-700">{tag.count}</span>
	<span class="max-w-12 flex-1 text-sm text-pink-600">{tag.like}</span>
	<span class="max-w-12 flex-1 text-sm">{tag.repost}</span>
	<span class="max-w-12 flex-1 text-sm">{tag.reply}</span>
	<span class="max-w-12 flex-1 text-sm">{tag.quote}</span>
{/snippet}
