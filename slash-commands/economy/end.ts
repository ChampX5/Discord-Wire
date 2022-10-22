import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../../Schemas/UserSchema';
import { SlashCommand } from '../../classes';

export default {
    name: 'end',
    category: 'ECONOMY',
    description: 'End your cash career.',

    callback: async ({ interaction }) => {
        const data = await User.findOne({ id: interaction.user.id });

        if (!data) {
            await interaction.reply({
                content: 'You have to start playing to stop playing!'
            });
            return;
        }

        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder({
                custom_id: 'eco-delete',
                label: 'Delete',
                style: ButtonStyle.Danger
            }),

            new ButtonBuilder({
                custom_id: 'eco-noDelete',
                label: "Don't delete!",
                style: ButtonStyle.Success
            })
        );

        await interaction.reply({
            content:
                'Are you absolutely SURE you want to delete your account? This will delete all progress.',
            components: [row]
        });
    }
} as SlashCommand;
