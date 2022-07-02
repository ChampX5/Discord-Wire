import { SlashCommand } from '../classes';
import Canvas from 'canvas';
import path from 'path';
import { MessageAttachment } from 'discord.js';

export default {

	name: 'wanted',
	description: 'Gives a "Wanted" image of the user.',
	category: 'MISC',

	options: [
		{
			name: 'target',
			description: 'The user whose avatar you want.',
			type: 'USER',
			required: false
		}
	],

	callback: async ({ interaction, user }) => {
		let target = interaction.options.getUser('target') || user;

		await interaction.deferReply();

		const canvas = Canvas.createCanvas(736, 993);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage(
			path.join(__dirname, '../wantedTemplate.png')
		)

		ctx.drawImage(background, 0, 0);

		const image = await Canvas.loadImage(
			target.displayAvatarURL({
				dynamic: true,
				format: 'png',
				size: 512
			})
		);

		ctx.drawImage(image, 141, 349);

		await interaction.editReply({
			files: [new MessageAttachment(canvas.toBuffer())]
		});
	}
} as SlashCommand;
