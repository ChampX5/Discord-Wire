import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

import { SlashCommand } from '../../classes';

export default {
    name: 'ban',
    description: 'Bans the mentioned user.',
    category: 'MOD',

    options: [
        {
            name: 'target',
            description: 'The user that gets banned.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: "The reason you're banning this user.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'delete_messages',
            description:
                'The number of messages you want to delete from today.',
            type: ApplicationCommandOptionType.Number,
            required: true,

            choices: [
                {
                    name: "Don't Delete Any",
                    value: 0
                },
                {
                    name: 'Previous 24 hours',
                    value: 24 * 60 * 60 * 1000
                },
                {
                    name: 'Previous 7 Days',
                    value: 7 * 24 * 60 * 60 * 1000
                }
            ]
        }
    ],
    permissions: ['BanMembers'],

    callback: async ({ interaction, client, guild }) => {
        const user = interaction.options.get('target', true).user!;
        const serverMember = guild.members.cache.get(user.id)!;

        const reason = interaction.options.get('reason', true).value as string;
        const days = interaction.options.get('delete_messages', true)
            .value as number;

        if (serverMember.user.id === client.user!.id) {
            await interaction.reply({
                content: `Sorry friend, I cannot ban myself.`,
                ephemeral: true
            });
            return;
        }

        if (!serverMember.bannable) {
            await interaction.reply({
                content: `I'm not able to ban ${serverMember.displayName}...`,
                ephemeral: true
            });
            return;
        }

        const interactionReply = new EmbedBuilder()
            .setTitle('SUCCESS')
            .setColor('Green')
            .setDescription(
                `${user.username} has been banned from the server.\nReason: ${reason}`
            );

        if (serverMember.user.bot) {
            await serverMember.ban({
                reason: reason,
                deleteMessageDays: days
            });

            await interaction.reply({
                embeds: [interactionReply]
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Banned from ${interaction.guild?.name}`)
            .setDescription(
                `You were banned from ${interaction.guild?.name}\nReason: ${reason}`
            )
            .setColor('Blue');

        const channel = await serverMember.createDM(true);

        await channel
            .send({
                embeds: [embed]
            })
            .then(() => {
                serverMember
                    .ban({
                        reason: reason,
                        deleteMessageDays: days
                    })
                    .then(() => {
                        interaction.reply({
                            embeds: [interactionReply]
                        });
                    });
            });
    }
} as SlashCommand;
