import {
    GuildMember,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,
    ApplicationCommandType
} from 'discord.js';
import { ContextMenu } from '../handler';

export default {
    name: 'View Avatar',
    type: ApplicationCommandType.User,

    callback: async ({ interaction, guild }) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Blurple')
                    .setImage(
                        (
                            guild.members.cache.get(
                                interaction.targetId!
                            ) as GuildMember
                        ).displayAvatarURL({ size: 512 })
                    )
                    .setTitle(
                        `:frame_photo: ${
                            (
                                guild.members.cache.get(
                                    interaction.targetId!
                                ) as GuildMember
                            ).displayName
                        }'s display avatar.`
                    )
                    .setDescription(
                        `:link: [\`Check it out!\`](${(
                            guild.members.cache.get(
                                interaction.targetId!
                            ) as GuildMember
                        ).displayAvatarURL({
                            size: 512
                        })})`
                    )
            ],

            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder()
                        .setLabel('Open Avatar URL')
                        .setStyle(ButtonStyle.Link)
                        .setURL(
                            (
                                guild.members.cache.get(interaction.targetId!) as GuildMember
                            ).displayAvatarURL({ size: 512 })
                        )
                        .setDisabled(false)
                ])
            ],

            ephemeral: true
        });
    }
} as ContextMenu;
