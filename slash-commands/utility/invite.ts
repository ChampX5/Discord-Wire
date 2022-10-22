import { SlashCommand } from '../../classes';
import { ButtonBuilder, ActionRowBuilder, OAuth2Scopes, ButtonStyle } from 'discord.js';

export default {
    name: 'invite',
    description: 'Loved the bot? Invite it!',
    category: 'MISC',

    callback: async ({ interaction, client, invitePermissions }) => {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setURL(
                    client.generateInvite({
                        scopes: [
                            OAuth2Scopes.ApplicationsCommands,
                            OAuth2Scopes.Bot
                        ],
                        permissions: invitePermissions
                    })
                )
                .setStyle(ButtonStyle.Link)
                .setLabel('Click!')
        );

        await interaction.reply({
            content: 'Click!',
            components: [row]
        });
    }
} as SlashCommand;
