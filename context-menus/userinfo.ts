import { ContextMenu } from '../classes';

import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

export default {
    name: 'userinfo',
    type: ApplicationCommandType.User,

    callback: async ({ interaction, guild }) => {
        const target = guild.members.cache.get(interaction.targetId)!;

        const embed = new EmbedBuilder()

            .setTitle(target.user.username)
            .setColor('Purple')

            .setAuthor({
                name: target.user.tag,
                iconURL: target.user.avatarURL({ size: 512 })!
            })
            .setThumbnail(
                target.user.avatarURL({
                    size: 512
                })!
            )

            .addFields([
                { name: 'ID', value: target.user.id.toString() },
                
                {
                    name: 'Roles',
                    value: `${
                        target.roles.cache
                            .map((r) => r)
                            .join(' ')
                            .replace('@everyone', '') || 'None'
                    }`
                },
                
                {
                    name: 'Member Since',
                    value: `<t:${(target.joinedTimestamp! / 1000).toFixed(0)}>`
                },

                {
                    name: 'Discord User Since',
                    value: `<t:${(target.user.createdTimestamp / 1000).toFixed(0)}>`
                }
            ]);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
} as ContextMenu;
