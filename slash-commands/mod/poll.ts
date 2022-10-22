import { Message, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../classes';
import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'poll',
    description: 'Start a poll!',
    category: 'MISC',

    permissions: ['Administrator'],

	options: [
		{
			name: 'question',
			description: 'The question to be asked.',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'choice_a',
			description: 'The first choice.',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'choice_b',
			description: 'The second choice.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],

    callback: async ({ interaction }) => {
        const first = interaction.options.get('choice_a', true).value as string;
        const second = interaction.options.get('choice_b', true).value as string;

        const question = interaction.options.get('question', true).value as string;

        const embed = new EmbedBuilder()

            .setTitle(question)
            .setDescription(`:one: ${first}\n:two: ${second}`);

        const message = (await interaction.reply({
            embeds: [embed],
            fetchReply: true
        })) as Message;

        message.react('1️⃣');
        message.react('2️⃣');
    }
} as SlashCommand;
