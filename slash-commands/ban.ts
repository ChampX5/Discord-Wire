import { MessageEmbed } from 'discord.js';

import { SlashCommand } from '../classes';

export default {
	name: 'ban',
	description: 'Bans the mentioned user.',
	category: 'MOD',

	options: [
		{
			name: 'target',
			description: 'The user that gets banned',
			type: 'USER',
			required: true
		},
		{
			name: 'reason',
			description: 'The user that gets banned',
			type: 'STRING',
			required: true
		},
		{
			name: 'delete_messages',
			description: 'The user that gets banned',
			type: 'NUMBER',
			required: true,

			choices: [
				{
					name: "Don't Delete Any",
					value: 0
				},
				{
					name: 'Previous 24 hours',
					value: 24 * 60 * 60 * 1000
				},
				{
					name: 'Previous 7 Days',
					value: 7 * 24 * 60 * 60 * 1000
				}
			]
		}
	],
	permissions: ['BAN_MEMBERS'],

	callback: async ({ interaction, client, guild }) => {
		const user = interaction.options.getUser('target')!;
		const serverMember = guild.members.cache.get(user.id)!;

		const reason = interaction.options.getString('reason', true);
		const days = interaction.options.getNumber('delete_messages', true);

		if (serverMember.user.id === client.user!.id) {
			await interaction.reply({
				content: `Sorry friend, I cannot ban myself.`,
				ephemeral: true
			});
			return;
		}

		if (!serverMember.bannable) {
			await interaction.reply({
				content: `I'm not able to ban ${serverMember.displayName}...`,
				ephemeral: true
			});
			return;
		}

		const interactionReply = new MessageEmbed()
			.setTitle('SUCCESS')
			.setColor('GREEN')
			.setDescription(
				`${user.username} has been banned from the server.\nReason: ${reason}`
			);

		if (serverMember.user.bot) {
			await serverMember.ban({
				reason: reason,
				days: days
			});
			await interaction.reply({
				embeds: [interactionReply]
			});
			return;
		}

		const embed = new MessageEmbed()
			.setTitle(`Banned from ${interaction.guild?.name}`)
			.setDescription(
				`You were banned from ${interaction.guild?.name}\nReason: ${reason}`
			)
			.setColor('BLUE');

		const channel = await serverMember.createDM(true);

		await channel.send({
			embeds: [embed]
		}).then(() => {
			serverMember
					.ban({
						reason: reason as string,
						days: days
					})
					.then(() => {
						interaction.reply({
							embeds: [interactionReply]
						});
					});
		});
	}
} as SlashCommand;
