<script lang="ts">
	import { Feed } from '$lib/models/post.response';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	const { form }: PageProps = $props();
	console.log(form);
	let feed = $derived(new Feed(form?.results || []));
	let count = $derived(feed.posts.length || 0);
	let search = $state('');
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form method="POST" use:enhance>
	<input name="search" bind:value={search} required />
</form>

<p>Search for #{search}</p>
{#if feed}
	<div class="flex flex-col gap-12 p-4">
		<h2>RESULTS: {count}</h2>

		<h2>Tags</h2>
		<p>
			{Array.from(feed.countTags.entries())
				.sort((a, b) => b[1] - a[1])
				.map(([tag, count]) => `${tag}: ${count}`)
				.join(' - ')}
		</p>

		<h2>Posts</h2>
		{#each feed.posts as post (post.id)}
			<p>{post.text}</p>
		{/each}
	</div>
{/if}
