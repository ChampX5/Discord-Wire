import {
    EmbedBuilder,
    Message,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';
import { Button } from '../../handler';

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

        const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setLabel('Clear')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('calc-clear')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('(')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-leftBracket')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel(')')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-rightBracket')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('/')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-divide')
                .setDisabled(true)
        ]);

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setLabel('7')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-7')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('8')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-8')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('9')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-9')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('*')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-multiply')
                .setDisabled(true)
        ]);

        const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setLabel('4')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-4')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('5')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-5')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('6')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-6')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('-')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-subtract')
                .setDisabled(true)
        ]);

        const row4 = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setLabel('1')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-1')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('2')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-2')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('3')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-3')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('+')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-add')
                .setDisabled(true)
        ]);

        const row5 = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setLabel('.')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-point')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('0')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('calc-0')
                .setDisabled(true),

            new ButtonBuilder()
                .setEmoji('◀')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('calc-backspace')
                .setDisabled(true),

            new ButtonBuilder()
                .setLabel('=')
                .setStyle(ButtonStyle.Success)
                .setCustomId('calc-equal')
                .setDisabled(true)
        ]);

        const embed = new EmbedBuilder()
            .setTitle('Calculator!')
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setDescription(
                `\`\`\`\n${expression} = ${eval(expression.toString())}\n\`\`\``
            )
            .setColor('DarkButNotBlack');

        interaction.deferUpdate();

        (interaction.message as Message).edit({
            embeds: [embed],
            components: [row1, row2, row3, row4, row5]
        });
    }
} as Button;
