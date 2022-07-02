import { MessageEmbed, Message } from 'discord.js';
import { Button } from '../../classes';

export default {
    customId: 'calc-clear',

    callback: async ({ interaction, user }) => {
        const embed = new MessageEmbed()
            .setTitle("Calculator!")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setDescription(`\`\`\`\nEquation: \n\`\`\``)
            .setColor("DARK_BUT_NOT_BLACK");

        interaction.deferUpdate();

        (interaction.message as Message).edit({
            embeds: [embed],
        });
    }
} as Button;
