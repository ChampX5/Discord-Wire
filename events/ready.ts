import { Event } from '../classes';

export default {
	name: 'ready',
	once: true,

	callback: async ({}, client) => {
		console.log(`Logged in as ${client.user!.tag}!`);

		client.user!.setPresence({
			activities: [
				{
					name: `/help`,
					type: 'WATCHING'
				}
			],
			status: 'online'
		});
	}
} as Event<'ready'>;
