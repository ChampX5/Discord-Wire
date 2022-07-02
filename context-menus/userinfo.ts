import { ContextMenu } from '../classes';

import { MessageEmbed } from 'discord.js';

export default {
    name: 'userinfo',
    type: 'USER',

    callback: async ({ interaction, guild, variables }) => {
        const target = guild.members.cache.get(interaction.targetId)!;

        const embed = new MessageEmbed()

            .setTitle(target.user.username)
            .setColor('PURPLE')

            .setAuthor({
                name: target.user.tag,
                iconURL: target.user.avatarURL({ dynamic: true, size: 512 })!
            })
            .setThumbnail(
                target.user.avatarURL({
                    dynamic: true,
                    size: 512,
                    format: 'png'
                })!
            )

            .addField('ID', target.user.id.toString())
            .addField(
                'Roles',
                `${
                    target.roles.cache
                        .map((r) => r)
                        .join(' ')
                        .replace('@everyone', '') || 'None'
                }`
            )
            .addField(
                'Member Since',
                `<t:${(target.joinedTimestamp! / 1000).toFixed(0)}:R>`,
                true
            )
            .addField(
                'Discord User Since',
                `<t:${(target.user.createdTimestamp / 1000).toFixed(0)}:R>`,
                true
            );

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
} as ContextMenu;
