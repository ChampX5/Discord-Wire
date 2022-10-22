import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommand } from '../../classes';
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'kick',
    description: 'Kicks the mentioned user.',
    category: 'MOD',

    options: [
        {
            name: 'user',
            description: 'The user that gets kicked',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: "The reason you're kicking this person.",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    permissions: ['KickMembers'],

    callback: async ({ interaction, client }) => {
        const user = interaction.options.getUser('user')!;
        const serverMember = interaction.guild?.members.cache.get(user.id)!;

        let reason: string;

        if ((interaction.options.get('reason')!.value as string) === null) {
            reason = 'No reason provided.';
        } else {
            reason = interaction.options.get('reason')!.value as string;
        }

        if (serverMember.user.id === client.user!.id) {
            await interaction.reply({
                content: `I cannot kick myself, sire.`,
                ephemeral: true
            });
            return;
        }

        if (!serverMember.kickable) {
            await interaction.reply({
                content: `I'm not able to kick ${serverMember.displayName}`,
                ephemeral: true
            });
            return;
        }

        const interactionReply = new EmbedBuilder()
            .setTitle('SUCCESS')
            .setColor('Green')
            .setDescription(
                `${user.username} has been kicked from the server.\nReason: ${reason}`
            );

        if (serverMember.user.bot) {
            serverMember.kick(reason);
            await interaction.reply({
                embeds: [interactionReply]
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Kicked from ${interaction.guild?.name}`)
            .setDescription(
                `You were kicked from ${interaction.guild?.name}\nReason: ${reason}`
            )
            .setColor('Blue');

        serverMember
            .createDM()
            .then((channel) =>
                channel.send({
                    embeds: [embed]
                })
            )
            .then((message) => {
                serverMember.kick(reason).then((member) => {
                    interaction.reply({
                        embeds: [interactionReply]
                    });
                });
            });
    }
} as SlashCommand;
