import { EmbedBuilder, Message } from 'discord.js';
import { Button } from '../../handler';

export default {
    customId: 'calc-subtract',

    callback: async ({ interaction, user }) => {
        const content = interaction.message.embeds[0].description!
            .toString()
            .slice(
                4,
                interaction.message.embeds[0].description!.toString().length - 4
            );

        const embed = new EmbedBuilder()
            .setTitle("Calculator!")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setDescription(`\`\`\`\n${content} - \n\`\`\``)
            .setColor('DarkButNotBlack')

        interaction.deferUpdate();

        (interaction.message as Message).edit({
            embeds: [embed],
        });
    }
} as Button;
