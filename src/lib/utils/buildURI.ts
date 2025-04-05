export function buildURI<T extends Record<string, unknown>>(params: T) {
	return Object.entries(params).map(([key, value]) => {
		return `${key}=${encodeURIComponent(String(value))}`;
	});
}
