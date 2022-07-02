import { SlashCommand } from '../classes';

export default {
	name: 'unban',
	description: 'Unban a banned user.',
	category: 'MOD',
	options: [
		{
			name: 'user-id',
			description: "The USER's ID you want to unban.",
			required: true,
			type: 'STRING'
		}
	],
	permissions: ['BAN_MEMBERS'],
	callback: async ({ interaction, guild }) => {
		const userId = interaction.options.getString('user-id')!;
		guild.members
			.unban(userId)
			.then((user) => {
				interaction.reply({
					content: `${user!.tag} is unbanned from the server!`
				});
			})
			.catch(() => {
				interaction.reply({
					content: `Please specify a valid **BANNED MEMBER'S** ID.`
				});
			});
	}
} as SlashCommand;
