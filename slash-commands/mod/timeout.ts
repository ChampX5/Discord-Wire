import { SlashCommand } from '../../handler';

import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export default {
	name: 'timeout',
	description: 'Mutes a person  by using the new discord timeout feature!',
	category: 'MOD',

	permissions: ['ModerateMembers'],

	options: [
		{
			name: 'target',
			description: 'The user that gets timed out.',
			required: true,
			type: ApplicationCommandOptionType.User
		},
		{
			name: 'duration',
			description:
				'For how much time you want this user to be timed out.',
			required: true,
			type: ApplicationCommandOptionType.Integer,
			choices: [
				{
					name: '60 secs',
					value: 60 * 1000
				},
				{
					name: '5 mins',
					value: 5 * 60 * 1000
				},
				{
					name: '10 mins',
					value: 10 * 60 * 1000
				},
				{
					name: '1 hour',
					value: 60 * 60 * 1000
				},
				{
					name: '1 day',
					value: 24 * 60 * 60 * 1000
				},
				{
					name: '1 week',
					value: 7 * 24 * 60 * 60 * 1000
				}
			]
		},
		{
			name: 'reason',
			description: 'The reason you\'re timing this user out.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	callback: async ({ interaction, guild }) => {
		const user = interaction.options.getUser('target')!;
		const member = guild.members.cache.get(user.id);

		const reason = interaction.options.get('reason', true).value as string;

		const duration = interaction.options.get('duration', true).value as number;

		if (!member) {
			interaction.reply({
				content: `Member provided doesn't exist in the server.`,
				ephemeral: true
			});
			return;
		}

		if (!member.moderatable) {
			interaction.reply({
				content: 'Sorry, I am not able to timeout this person.',
				ephemeral: true
			});
		}

		if (!user.bot) {
			member.timeout(duration, reason).then((serverMember) => {
				serverMember.createDM().then((channel) => {
					let durationText: string = '60 secs';

					switch (duration) {
						case 60 * 1000:
							durationText = '60 secs';
							break;

						case 5 * 60 * 1000:
							durationText = '5 min';
							break;

						case 10 * 60 * 1000:
							durationText = '10 min';
							break;

						case 60 * 60 * 1000:
							durationText = '1 hour';
							break;

						case 24 * 60 * 60 * 1000:
							durationText = '1 day';
							break;

						case 7 * 24 * 60 * 60 * 1000:
							durationText = '1 week';
							break;
					}
					const interactionReply = new EmbedBuilder()
						.setTitle('Timeout Notice!')
						.setDescription(
							`You have been timed out in ${interaction.guild?.name} for ${durationText}.`
						)
						.setColor('Blue');
					channel.send({
						embeds: [interactionReply]
					});
				});
			});
		} else {
			member.timeout(duration, reason);
		}

		const embed = new EmbedBuilder()
			.setTitle('SUCCESS')
			.setDescription(
				`${user.username} has been timed out for ${duration} minutes.`
			)
			.setColor('Green');

		interaction.reply({
			embeds: [embed]
		});
	}
} as SlashCommand;
