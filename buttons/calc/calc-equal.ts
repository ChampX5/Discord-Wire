import {
    MessageEmbed,
    Message,
    MessageActionRow,
    MessageButton
} from 'discord.js';
import { Button } from '../../classes';

export default {
    customId: 'calc-equal',

    callback: async ({ interaction, user }) => {
        const content = interaction.message.embeds[0]
            .description!.toString()
            .slice(
                4,
                interaction.message.embeds[0].description!.toString().length - 4
            );

        const expression = content.slice(10, content.length);

        const row1 = new MessageActionRow().addComponents([
            new MessageButton()
                .setLabel('Clear')
                .setStyle('DANGER')
                .setCustomId('calc-clear')
                .setDisabled(true),

            new MessageButton()
                .setLabel('(')
                .setStyle('PRIMARY')
                .setCustomId('calc-leftBracket')
                .setDisabled(true),

            new MessageButton()
                .setLabel(')')
                .setStyle('PRIMARY')
                .setCustomId('calc-rightBracket')
                .setDisabled(true),

            new MessageButton()
                .setLabel('/')
                .setStyle('PRIMARY')
                .setCustomId('calc-divide')
                .setDisabled(true)
        ]);

        const row2 = new MessageActionRow().addComponents([
            new MessageButton()
                .setLabel('7')
                .setStyle('SECONDARY')
                .setCustomId('calc-7')
                .setDisabled(true),

            new MessageButton()
                .setLabel('8')
                .setStyle('SECONDARY')
                .setCustomId('calc-8')
                .setDisabled(true),

            new MessageButton()
                .setLabel('9')
                .setStyle('SECONDARY')
                .setCustomId('calc-9')
                .setDisabled(true),

            new MessageButton()
                .setLabel('*')
                .setStyle('PRIMARY')
                .setCustomId('calc-multiply')
                .setDisabled(true)
        ]);

        const row3 = new MessageActionRow().addComponents([
            new MessageButton()
                .setLabel('4')
                .setStyle('SECONDARY')
                .setCustomId('calc-4')
                .setDisabled(true),

            new MessageButton()
                .setLabel('5')
                .setStyle('SECONDARY')
                .setCustomId('calc-5')
                .setDisabled(true),

            new MessageButton()
                .setLabel('6')
                .setStyle('SECONDARY')
                .setCustomId('calc-6')
                .setDisabled(true),

            new MessageButton()
                .setLabel('-')
                .setStyle('PRIMARY')
                .setCustomId('calc-subtract')
                .setDisabled(true)
        ]);

        const row4 = new MessageActionRow().addComponents([
            new MessageButton()
                .setLabel('1')
                .setStyle('SECONDARY')
                .setCustomId('calc-1')
                .setDisabled(true),

            new MessageButton()
                .setLabel('2')
                .setStyle('SECONDARY')
                .setCustomId('calc-2')
                .setDisabled(true),

            new MessageButton()
                .setLabel('3')
                .setStyle('SECONDARY')
                .setCustomId('calc-3')
                .setDisabled(true),

            new MessageButton()
                .setLabel('+')
                .setStyle('PRIMARY')
                .setCustomId('calc-add')
                .setDisabled(true)
        ]);

        const row5 = new MessageActionRow().addComponents([
            new MessageButton()
                .setLabel('.')
                .setStyle('PRIMARY')
                .setCustomId('calc-point')
                .setDisabled(true),

            new MessageButton()
                .setLabel('0')
                .setStyle('SECONDARY')
                .setCustomId('calc-0')
                .setDisabled(true),

            new MessageButton()
                .setEmoji('◀')
                .setStyle('PRIMARY')
                .setCustomId('calc-backspace')
                .setDisabled(true),

            new MessageButton()
                .setLabel('=')
                .setStyle('SUCCESS')
                .setCustomId('calc-equal')
                .setDisabled(true)
        ]);

        const embed = new MessageEmbed()
            .setTitle('Calculator!')
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setDescription(
                `\`\`\`\n${expression} = ${eval(expression.toString())}\n\`\`\``
            )
            .setColor('DARK_BUT_NOT_BLACK');

        interaction.deferUpdate();

        (interaction.message as Message).edit({
            embeds: [embed],
            components: [row1, row2, row3, row4, row5]
        });
    }
} as Button;
