import { EmbedBuilder, Message } from 'discord.js';
import { Button } from '../../classes';

export default {
    customId: 'calc-backspace',

    callback: async ({ interaction, user }) => {
        const content = interaction.message.embeds[0].description!
            .toString()
            .slice(
                4,
                interaction.message.embeds[0].description!.toString().length - 4
            );

        let contentSend = "";

        if (content.length === 10) {
            contentSend = content;
        } else {
            contentSend = content.slice(0, content.length - 1);
        }

        const embed = new EmbedBuilder()
            .setTitle("Calculator!")
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`\`\`\`\n${contentSend}\n\`\`\``)
            .setColor('DarkButNotBlack')

        interaction.deferUpdate();

        (interaction.message as Message).edit({
            embeds: [embed],
        });
    }
} as Button;
