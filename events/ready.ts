import { ActivityType } from 'discord.js';
import { Event } from '../handler';

export default {
	name: 'ready',
	once: true,

	callback: async ({}, client) => {
		console.log(`Logged in as ${client.user!.tag}!`);

		client.user!.setPresence({
			activities: [
				{
					name: `/command`,
					type: ActivityType.Watching
				}
			],
			status: 'online'
		});
	}
} as Event<'ready'>;
