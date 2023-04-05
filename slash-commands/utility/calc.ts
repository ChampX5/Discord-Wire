import { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } from 'discord.js';

import { SlashCommand } from '../../handler';

export default {
	name: 'calc',
	category: 'MISC',
	description: 'A Calculator made of buttons!',

	callback: async ({ interaction, member }) => {
		const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setLabel('Clear')
				.setStyle(ButtonStyle.Danger)
				.setCustomId('calc-clear'),

			new ButtonBuilder()
				.setLabel('(')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-leftBracket'),

			new ButtonBuilder()
				.setLabel(')')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-rightBracket'),

			new ButtonBuilder()
				.setLabel('/')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-divide')
		]);

		const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setLabel('7')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-7'),

			new ButtonBuilder()
				.setLabel('8')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-8'),

			new ButtonBuilder()
				.setLabel('9')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-9'),

			new ButtonBuilder()
				.setLabel('*')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-multiply')
		]);

		const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setLabel('4')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-4'),

			new ButtonBuilder()
				.setLabel('5')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-5'),

			new ButtonBuilder()
				.setLabel('6')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-6'),

			new ButtonBuilder()
				.setLabel('-')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-subtract')
		]);

		const row4 = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setLabel('1')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-1'),

			new ButtonBuilder()
				.setLabel('2')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-2'),

			new ButtonBuilder()
				.setLabel('3')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-3'),

			new ButtonBuilder()
				.setLabel('+')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-add')
		]);

		const row5 = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setLabel('.')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-point'),

			new ButtonBuilder()
				.setLabel('0')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('calc-0'),

			new ButtonBuilder()
				.setEmoji('◀')
				.setStyle(ButtonStyle.Primary)
				.setCustomId('calc-backspace'),

			new ButtonBuilder()
				.setLabel('=')
				.setStyle(ButtonStyle.Success)
				.setCustomId('calc-equal')
		]);

		const embed = new EmbedBuilder()
			.setTitle('Calculator!')
			.setAuthor({
				name: member.displayName,
				iconURL: member.displayAvatarURL()
			})
			.setDescription('```\nEquation: \n```')
			.setColor('DarkButNotBlack');

		await interaction.reply({
			embeds: [embed],
			components: [row1, row2, row3, row4, row5]
		});
	}
} as SlashCommand;
