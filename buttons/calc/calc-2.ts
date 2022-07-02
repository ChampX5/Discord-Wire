import { Button } from "../../classes";

import { MessageEmbed, Message } from 'discord.js';

export default {
    customId: 'calc-2',
    
    callback: async ({ interaction, user }) => {
        const content = interaction.message.embeds[0].description!
            .toString()
            .slice(
                4,
                interaction.message.embeds[0].description!.toString().length - 4
            );

        const embed = new MessageEmbed()
            .setTitle("Calculator!")
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setDescription(`\`\`\`\n${content}2\n\`\`\``)
            .setColor("DARK_BUT_NOT_BLACK");

        interaction.deferUpdate();

        (interaction.message as Message).edit({
            embeds: [embed],
        });
    }
} as Button;