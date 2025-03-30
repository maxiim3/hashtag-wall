import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { AtpAgent } from '@atproto/api';

if (!env.BS_ID) throw new Error('LOGIN is not set');
if (!dev && !env.BS_PASSWORD) throw new Error('PASSWORD is not set');

export const agent = new AtpAgent({
	service: 'https://bsky.social'
});
