import { SlashCommand } from '../../classes';
import Canvas from 'canvas';
import path from 'path';
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';

export default {
    name: 'wanted',
    description: 'Gives a "Wanted" image of the user.',
    category: 'MISC',

    options: [
        {
            name: 'target',
            description: 'The user whose avatar you want.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    callback: async ({ interaction, user }) => {
        const target = interaction.options.get('target')?.user || user;

        await interaction.deferReply();

        const canvas = Canvas.createCanvas(736, 993);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(
            path.join(__dirname, '../../wantedTemplate.png')
        );

        ctx.drawImage(background, 0, 0);

        const image = await Canvas.loadImage(
            target.displayAvatarURL({
                size: 512
            })
        );

        ctx.drawImage(image, 141, 349);

        await interaction.editReply({
            files: [new AttachmentBuilder(canvas.toBuffer())]
        });
    }
} as SlashCommand;
