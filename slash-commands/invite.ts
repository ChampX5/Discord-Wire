import { SlashCommand } from '../classes';
import { MessageButton, MessageActionRow } from 'discord.js';

export default {
	name: 'invite',
	description: 'Loved the bot? Invite it!',
	category: 'MISC',

	callback: async ({ interaction, client, invitePermissions }) => {
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setURL(
					client.generateInvite({
						scopes: ['applications.commands', 'bot'],
						permissions: invitePermissions
					})
				)
				.setStyle('LINK')
				.setLabel('Click!')
		);

		await interaction.reply({
			content: 'Click!',
			components: [row]
		});
	}
} as SlashCommand;
