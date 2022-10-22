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
        } catch {
            await interaction.reply({
                content:
                    "I don't have enough permissions to delete the messages in this channel.",
                ephemeral: true
            });

            return;
        }
    }
} as SlashCommand;
