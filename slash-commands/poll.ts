import { Message, MessageEmbed } from 'discord.js';
import { SlashCommand } from '../classes';

export default {
    name: 'poll',
    description: 'Start a poll!',
    category: 'MISC',
    permissions: ['ADMINISTRATOR'],

	options: [
		{
			name: 'question',
			description: 'The question to be asked.',
			type: 'STRING',
			required: true
		},
		{
			name: 'choice_a',
			description: 'The first choice.',
			type: 'STRING',
			required: true
		},
		{
			name: 'choice_b',
			description: 'The second choice.',
			type: 'STRING',
			required: true
		}
	],

    callback: async ({ interaction }) => {
        const first = interaction.options.getString('choice_a', true);
        const second = interaction.options.getString('choice_b', true);

        const question = interaction.options.getString('question', true);

        const embed = new MessageEmbed()

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
