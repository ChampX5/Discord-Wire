import { SlashCommand } from '../classes';
import { MessageEmbed } from 'discord.js';

export default {
	name: 'send-embed',
	description: 'Send an embed!',
	category: 'MISC',

	options: [
		{
			name: 'title',
			description: 'The title of the embed',
			type: 'STRING',
			required: true
		},
		{
			name: 'description',
			description: 'The description of the embed',
			type: 'STRING',
			required: true
		},
		{
			name: 'footer',
			description: 'The footer of the embed',
			type: 'STRING',
			required: true
		}
	],
	
	callback: async ({ interaction }) => {
		const embed = new MessageEmbed()
			.setTitle(interaction.options.getString('title')!)
			.setDescription(interaction.options.getString('description')!)
			.setFooter({
				text: interaction.options.getString('footer')!
			})
			.setColor('NOT_QUITE_BLACK');

		interaction.reply({
			embeds: [embed]
		});
	}
} as SlashCommand;
