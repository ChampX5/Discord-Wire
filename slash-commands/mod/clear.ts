import { ApplicationCommandOptionType, GuildChannel } from 'discord.js';
import { SlashCommand } from '../../classes';

export default {
    name: 'clear',
    category: 'MOD',
    description: 'Delete a certain number of messages',

    permissions: ['Administrator'],

    options: [
        {
            name: 'messages_to_delete',
            description:
                'The number of messages you want to delete from this channel',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],

    callback: async ({ interaction, channel }) => {
        let number = interaction.options.get('messages_to_delete', true)
            .value as number;

        if (number > 100) {
            await interaction.reply({
                content: 'That is too many messages! I can only clear 100 messages at a time.',
                ephemeral: true
            });

            return;
        }

        const messages = await channel.messages.fetch({
            limit: number
        });

        try {
            await channel.bulkDelete(messages);

            await interaction.reply({
                content: `Deleted ${number} ${
                    number === 1 ? 'message' : 'messages'
                } successfully!`,
                ephemeral: true
            });
        } catch (err) {
            console.error(err);

            await interaction.reply({
                content:
                    "Something went wrong. Failed.",
                ephemeral: true
            });

            return;
        }
    }
} as SlashCommand;
