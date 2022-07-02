import { MessageButton, MessageEmbed, MessageActionRow } from 'discord.js';

import { SlashCommand } from '../classes';

export default {
	name: 'calc',
	category: 'MISC',
	description: 'A Calculator made of buttons!',

	callback: async ({ interaction, member }) => {
		const row1 = new MessageActionRow().addComponents([
			new MessageButton()
				.setLabel('Clear')
				.setStyle('DANGER')
				.setCustomId('calc-clear'),

			new MessageButton()
				.setLabel('(')
				.setStyle('PRIMARY')
				.setCustomId('calc-leftBracket'),

			new MessageButton()
				.setLabel(')')
				.setStyle('PRIMARY')
				.setCustomId('calc-rightBracket'),

			new MessageButton()
				.setLabel('/')
				.setStyle('PRIMARY')
				.setCustomId('calc-divide')
		]);

		const row2 = new MessageActionRow().addComponents([
			new MessageButton()
				.setLabel('7')
				.setStyle('SECONDARY')
				.setCustomId('calc-7'),

			new MessageButton()
				.setLabel('8')
				.setStyle('SECONDARY')
				.setCustomId('calc-8'),

			new MessageButton()
				.setLabel('9')
				.setStyle('SECONDARY')
				.setCustomId('calc-9'),

			new MessageButton()
				.setLabel('*')
				.setStyle('PRIMARY')
				.setCustomId('calc-multiply')
		]);

		const row3 = new MessageActionRow().addComponents([
			new MessageButton()
				.setLabel('4')
				.setStyle('SECONDARY')
				.setCustomId('calc-4'),

			new MessageButton()
				.setLabel('5')
				.setStyle('SECONDARY')
				.setCustomId('calc-5'),

			new MessageButton()
				.setLabel('6')
				.setStyle('SECONDARY')
				.setCustomId('calc-6'),

			new MessageButton()
				.setLabel('-')
				.setStyle('PRIMARY')
				.setCustomId('calc-subtract')
		]);

		const row4 = new MessageActionRow().addComponents([
			new MessageButton()
				.setLabel('1')
				.setStyle('SECONDARY')
				.setCustomId('calc-1'),

			new MessageButton()
				.setLabel('2')
				.setStyle('SECONDARY')
				.setCustomId('calc-2'),

			new MessageButton()
				.setLabel('3')
				.setStyle('SECONDARY')
				.setCustomId('calc-3'),

			new MessageButton()
				.setLabel('+')
				.setStyle('PRIMARY')
				.setCustomId('calc-add')
		]);

		const row5 = new MessageActionRow().addComponents([
			new MessageButton()
				.setLabel('.')
				.setStyle('PRIMARY')
				.setCustomId('calc-point'),

			new MessageButton()
				.setLabel('0')
				.setStyle('SECONDARY')
				.setCustomId('calc-0'),

			new MessageButton()
				.setEmoji('◀')
				.setStyle('PRIMARY')
				.setCustomId('calc-backspace'),

			new MessageButton()
				.setLabel('=')
				.setStyle('SUCCESS')
				.setCustomId('calc-equal')
		]);

		const embed = new MessageEmbed()
			.setTitle('Calculator!')
			.setAuthor({
				name: member.displayName,
				iconURL: member.displayAvatarURL()
			})
			.setDescription('```\nEquation: \n```')
			.setColor('DARK_BUT_NOT_BLACK');

		await interaction.reply({
			embeds: [embed],
			components: [row1, row2, row3, row4, row5]
		});
	}
} as SlashCommand;
