import { SlashCommand } from '../../classes';
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';

export default {
	name: 'send-embed',
	description: 'Send an embed!',
	category: 'MISC',

	options: [
		{
			name: 'title',
			description: 'The title of the embed',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'description',
			description: 'The description of the embed',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'footer',
			description: 'The footer of the embed',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	
	callback: async ({ interaction }) => {
		const embed = new EmbedBuilder()
			.setTitle(interaction.options.get('title', true).value as string)
			.setDescription(interaction.options.get('description', true).value as string)
			.setFooter({
				text: interaction.options.get('footer', true).value! as string
			})
			.setColor('NotQuiteBlack');

		interaction.reply({
			embeds: [embed]
		});
	}
} as SlashCommand;
