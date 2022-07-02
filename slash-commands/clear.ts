import { SlashCommand } from '../classes';

export default {
    name: 'clear',
    category: 'MOD',
    description: 'Delete a certain number of messages',

    options: [
        {
            name: 'messages_to_delete',
            description:
                'The number of messages you want to delete from this channel',
            type: 'NUMBER',
            required: true
        }
    ],

    callback: async ({ interaction, channel }) => {
        let number = interaction.options.getNumber('messages_to_delete')!;

        await channel.messages
            .fetch({
                limit: number
            })
            .then((messages) => {
                if (channel.type === 'DM') {
                    return;
                }

                channel.bulkDelete(messages).then(async () => {
                    let content;

                    if (number === 1) {
                        content = 'message';
                    } else {
                        content = 'messages';
                    }

                    await interaction.reply({
                        content: `Deleted ${number} ${content} successfully!`,
                        ephemeral: true
                    });
                });
            })
            .catch(async () => {
                await interaction.reply({
                    content:
                        "I don't have enough permissions to delete the messages in this channel.",
                    ephemeral: true
                });
                return;
            });
    }
} as SlashCommand;
