export function sortResponseBy<T extends Record<string, string | number>>(
	items: T[],
	key: keyof T,
	direction?: 0 | 1 | -1
) {
	const sort = direction ?? -1;
	console.log(items);

	return items.sort((prev, next) => {
		if (typeof prev[key] === 'number' && typeof next[key] === 'number') {
			console.log('number');
			return (prev[key] - next[key]) * sort;
		}

		const before = String(prev[key]);
		const after = String(next[key]);

		return before.localeCompare(after);
	});
}
