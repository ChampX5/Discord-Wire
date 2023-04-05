import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    GuildMember,
    ModalBuilder
} from 'discord.js';
import { SlashCommand } from '../../handler';

export default {
    name: 'rps',
    description: 'Play rock-paper-scissors with the bot!',
    category: 'MISC',

    options: [
        {
            name: 'option',
            description: 'Your choice!',
            type: ApplicationCommandOptionType.String,
            required: true,

            choices: [
                {
                    name: 'Scissors',
                    value: 's'
                },
                {
                    name: 'Paper',
                    value: 'p'
                },
                {
                    name: 'Rock',
                    value: 'r'
                }
            ]
        }
    ],

    callback: async ({ interaction }) => {
        const cc: 'r' | 'p' | 's' = ['r', 'p', 's'][
            Math.floor(Math.random() * 3)
        ] as 'r' | 'p' | 's';
        const mc = interaction.options.get('option', true).value as string;

        await interaction.deferReply({ fetchReply: true });

        const getChoiceName = (
            choice: 'r' | 'p' | 's'
        ): 'Rock 🪨' | 'Paper 📰' | 'Scissors ✂️' => {
            if (choice === 'r') {
                return 'Rock 🪨';
            } else if (choice === 'p') {
                return 'Paper 📰';
            } else if (choice === 's') {
                return 'Scissors ✂️';
            } else {
                return 'Scissors ✂️';
            }
        };

        let win: boolean | 'tie' = 'tie';

        if (cc === mc) {
            win = 'tie';
        } else if (cc === 'r') {
            if (mc === 'p') {
                win = true;
            } else if (mc === 's') {
                win = false;
            }
        } else if (cc === 'p') {
            if (mc === 's') {
                win = true;
            } else if (mc === 'r') {
                win = false;
            }
        } else if (cc === 's') {
            if (mc === 'r') {
                win = true;
            } else if (mc === 'p') {
                win = false;
            }
        }

        let embed = new EmbedBuilder()
            .setAuthor({
                name: (interaction.member! as GuildMember).displayName,
                iconURL: (interaction.member! as GuildMember).displayAvatarURL()
            })
            .setThumbnail(
                (interaction.member! as GuildMember).displayAvatarURL()
            )
            .setFooter({
                text: 'Last played'
            })
            .setTimestamp();

        if (win === 'tie') {
            embed = embed
                .setTitle('It is a tie!')
                .setDescription(
                    `Your choice: **${getChoiceName(
                        mc as 's' | 'r' | 'p'
                    )}**\nComputer's choice: **${getChoiceName(cc)}**`
                );

            await interaction.editReply({
                embeds: [embed]
            });
        } else if (win) {
            embed = embed
                .setTitle('You win!')
                .setDescription(
                    `Your choice: **${getChoiceName(
                        mc as 's' | 'r' | 'p'
                    )}**\nComputer's choice: **${getChoiceName(cc)}**`
                );

            await interaction.editReply({
                embeds: [embed]
            });
        } else if (!win) {
            embed = embed
                .setTitle('You lost!')
                .setDescription(
                    `Your choice: **${getChoiceName(
                        mc as 's' | 'r' | 'p'
                    )}**\nComputer's choice: **${getChoiceName(cc)}**`
                );

            await interaction.editReply({
                embeds: [embed]
            });
        }
    }
} as SlashCommand;
