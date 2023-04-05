import { SlashCommand } from '../../handler';
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'send-embed',
    description: 'Send an embed!',
    category: 'MISC',

    options: [
        {
            name: 'title',
            description: 'The title of the embed',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'description',
            description: 'The description of the embed',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'footer',
            description: 'The footer of the embed',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    callback: async ({ interaction }) => {
        const embed = new EmbedBuilder()
            .setTitle(interaction.options.getString('title', true))
            .setDescription(interaction.options.getString('description', true))
            .setFooter({
                text: interaction.options.getString('footer', true)
            })
            .setColor('NotQuiteBlack');

        await interaction.reply({
            embeds: [embed]
        });
    }
} as SlashCommand;
