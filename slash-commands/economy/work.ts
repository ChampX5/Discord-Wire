import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    GuildMember
} from 'discord.js';
import User from '../../Schemas/UserSchema';
import { SlashCommand } from '../../classes';

export default {
    name: 'work',
    category: 'ECONOMY',
    description: 'Earn your salary by completing a task.',

    options: [
        {
            name: 'apply',
            description: 'Apply for a job.',
            type: ApplicationCommandOptionType.Subcommand,

            options: [
                {
                    name: 'job',
                    description: 'The job you want to apply for.',
                    type: ApplicationCommandOptionType.String,

                    choices: [
                        {
                            name: 'Engineer',
                            value: 'engineer'
                        },
                        {
                            name: 'Doctor',
                            value: 'doctor'
                        },
                        {
                            name: 'Pilot',
                            value: 'pilot'
                        },
                        {
                            name: 'Discord Mod',
                            value: 'discord-mod'
                        },
                        {
                            name: 'Youtuber',
                            value: 'youtuber'
                        }
                    ],

                    required: true
                }
            ]
        },

        {
            name: 'shift',
            description: 'Solve a puzzle and earn salary!',
            type: ApplicationCommandOptionType.Subcommand
        },

        {
            name: 'list',
            description: 'Get a list of professions to choose from.',
            type: ApplicationCommandOptionType.Subcommand
        },

        {
            name: 'resign',
            description: 'Resign from your job.',
            type: ApplicationCommandOptionType.Subcommand
        },

        {
            name: 'info',
            description:
                'Attain important information regarding your economic career.',
            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    callback: async ({ interaction }) => {
        if (!(await User.findOne({ id: interaction.user.id }))) {
            await interaction.reply({
                content:
                    "You haven't started playing yet! Type `/start` to create an account."
            });

            return;
        }

        if (interaction.options.getSubcommand() === 'shift') {
            if (!(await User.findOne({ id: interaction.user.id }))!.work) {
                await interaction.reply({
                    content:
                        "You currently don't have a job to work at. Use `/work apply` to find one."
                });

                return;
            }

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: (interaction.member as GuildMember).displayName,
                    iconURL: (
                        interaction.member as GuildMember
                    ).displayAvatarURL()
                })
                .setTitle('Work!')
                .setColor('Purple')
                .setDescription(
                    'Click the one you think is the correct button!'
                );

            const row1 = new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder({
                    customId: 'eco-btn-1',
                    label: '❔',
                    style: ButtonStyle.Secondary
                }),

                new ButtonBuilder({
                    customId: 'eco-btn-2',
                    label: '❔',
                    style: ButtonStyle.Secondary
                }),

                new ButtonBuilder({
                    customId: 'eco-btn-3',
                    label: '❔',
                    style: ButtonStyle.Secondary
                })
            );

            const row2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder({
                    customId: 'eco-btn-4',
                    label: '❔',
                    style: ButtonStyle.Secondary
                }),

                new ButtonBuilder({
                    customId: 'eco-btn-5',
                    label: '❔',
                    style: ButtonStyle.Secondary
                }),

                new ButtonBuilder({
                    customId: 'eco-btn-6',
                    label: '❔',
                    style: ButtonStyle.Secondary
                })
            );

            const row3 = new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder({
                    customId: 'eco-btn-7',
                    label: '❔',
                    style: ButtonStyle.Secondary
                }),

                new ButtonBuilder({
                    customId: 'eco-btn-8',
                    label: '❔',
                    style: ButtonStyle.Secondary
                }),

                new ButtonBuilder({
                    customId: 'eco-btn-9',
                    label: '❔',
                    style: ButtonStyle.Secondary
                })
            );

            const rand = Math.floor(Math.random() * 3);
            const correctIndex = Math.floor(Math.random() * 3);

            if (rand === 0) {
                row1.components[correctIndex].setCustomId('eco-btn-correct');
            } else if (rand === 1) {
                row2.components[correctIndex].setCustomId('eco-btn-correct');
            } else if (rand === 2) {
                row3.components[correctIndex].setCustomId('eco-btn-correct');
            }

            const message = await interaction.reply({
                embeds: [embed],
                components: [row1, row2, row3]
            });

            const collector = message.createMessageComponentCollector({
                time: 20000,

                componentType: ComponentType.Button,

                filter: (componentInteraction) => {
                    return componentInteraction.user.id === interaction.user.id;
                }
            });

            collector.on('collect', async (collectedInteraction) => {
                const data = (await User.findOne({
                    id: collectedInteraction.user.id
                }))!;

                data.work!.shifts += 1;

                if (collectedInteraction.customId === 'eco-btn-correct') {
                    const earning =
                        Math.floor(
                            Math.random() * (data.work!.salary!.top -
                                data.work!.salary!.bottom)
                        ) + data.work!.salary!.bottom;

                    await collectedInteraction.reply({
                        content: `You earned **${earning}** 🪙.`
                    });

                    data.wallet += earning;

                    collector.stop('collected');

                    const newRow1 =
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder({
                                customId: 'eco-btn-1',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-2',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-3',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            })
                        );

                    const newRow2 =
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder({
                                customId: 'eco-btn-4',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-5',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-6',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            })
                        );

                    const newRow3 =
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder({
                                customId: 'eco-btn-7',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-8',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-9',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            })
                        );

                    if (rand === 0) {
                        newRow1.components[correctIndex].setStyle(
                            ButtonStyle.Success
                        );
                        newRow1.components[correctIndex].setLabel('🟩');
                    } else if (rand === 1) {
                        newRow2.components[correctIndex].setStyle(
                            ButtonStyle.Success
                        );
                        newRow2.components[correctIndex].setLabel('🟩');
                    } else if (rand === 2) {
                        newRow3.components[correctIndex].setStyle(
                            ButtonStyle.Success
                        );
                        newRow3.components[correctIndex].setLabel('🟩');
                    }

                    await collectedInteraction.message.edit({
                        embeds: [embed],
                        components: [newRow1, newRow2, newRow3]
                    });
                } else {
                    collector.stop('collected');

                    const earning =
                        (Math.floor(
                            Math.random() * data.work!.salary!.top -
                                data.work!.salary!.bottom
                        ) + data.work!.salary!.bottom) / 4;

                    await collectedInteraction.reply({
                        content: `Wrong button! Nonetheless, you earned ${earning} 🪙 for your efforts.`
                    });

                    data.wallet += earning;

                    const newRow1 =
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder({
                                customId: 'eco-btn-1',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-2',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-3',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            })
                        );

                    const newRow2 =
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder({
                                customId: 'eco-btn-4',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-5',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-6',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            })
                        );

                    const newRow3 =
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder({
                                customId: 'eco-btn-7',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-8',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            }),

                            new ButtonBuilder({
                                customId: 'eco-btn-9',
                                label: '💀',
                                style: ButtonStyle.Danger,
                                disabled: true
                            })
                        );

                    if (rand === 0) {
                        newRow1.components[correctIndex].setStyle(
                            ButtonStyle.Success
                        );
                        newRow1.components[correctIndex].setLabel('🟩');
                    } else if (rand === 1) {
                        newRow2.components[correctIndex].setStyle(
                            ButtonStyle.Success
                        );
                        newRow2.components[correctIndex].setLabel('🟩');
                    } else if (rand === 2) {
                        newRow3.components[correctIndex].setStyle(
                            ButtonStyle.Success
                        );
                        newRow3.components[correctIndex].setLabel('🟩');
                    }

                    if (collectedInteraction.customId === 'eco-btn-1') {
                        newRow1.components[0].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-2') {
                        newRow1.components[1].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-3') {
                        newRow1.components[2].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-4') {
                        newRow2.components[0].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-5') {
                        newRow2.components[1].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-6') {
                        newRow2.components[2].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-7') {
                        newRow3.components[0].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-8') {
                        newRow3.components[1].setStyle(ButtonStyle.Primary);
                    } else if (collectedInteraction.customId === 'eco-btn-9') {
                        newRow3.components[2].setStyle(ButtonStyle.Primary);
                    }

                    await interaction.editReply({
                        embeds: [embed],
                        components: [newRow1, newRow2, newRow3]
                    });
                }

                data.save();
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'collected') {
                    return;
                }

                const msg = interaction.channel!.messages.cache.get(
                    collector.messageId!
                )!;

                const newRow1 =
                    new ActionRowBuilder<ButtonBuilder>().setComponents(
                        new ButtonBuilder({
                            customId: 'eco-btn-1',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        }),

                        new ButtonBuilder({
                            customId: 'eco-btn-2',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        }),

                        new ButtonBuilder({
                            customId: 'eco-btn-3',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        })
                    );

                const newRow2 =
                    new ActionRowBuilder<ButtonBuilder>().setComponents(
                        new ButtonBuilder({
                            customId: 'eco-btn-4',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        }),

                        new ButtonBuilder({
                            customId: 'eco-btn-5',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        }),

                        new ButtonBuilder({
                            customId: 'eco-btn-6',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        })
                    );

                const newRow3 =
                    new ActionRowBuilder<ButtonBuilder>().setComponents(
                        new ButtonBuilder({
                            customId: 'eco-btn-7',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        }),

                        new ButtonBuilder({
                            customId: 'eco-btn-8',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        }),

                        new ButtonBuilder({
                            customId: 'eco-btn-9',
                            label: '💀',
                            style: ButtonStyle.Danger,
                            disabled: true
                        })
                    );

                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: (interaction.member as GuildMember).displayName,
                        iconURL: (
                            interaction.member as GuildMember
                        ).displayAvatarURL()
                    })
                    .setTitle('Timed out.')
                    .setColor('Purple')
                    .setDescription('Too late!');

                await msg.edit({
                    embeds: [embed],
                    components: [newRow1, newRow2, newRow3]
                });
            });
        }

        if (interaction.options.getSubcommand() === 'apply') {
            const workList = {
                engineer: {
                    salary: 5000,
                    requiredShifts: 2
                },
                doctor: {
                    salary: 7500,
                    requiredShifts: 6
                },
                pilot: {
                    salary: 7750,
                    requiredShifts: 5
                },
                'discord-mod': {
                    salary: 3000,
                    requiredShifts: 0
                },
                youtuber: {
                    salary: 8000,
                    requiredShifts: 15
                }
            };

            const data = (await User.findOne({ id: interaction.user.id }))!;
            const jobName = interaction.options.getString('job', true);

            if (data.work) {
                if (
                    data.work.shifts >=
                    workList[jobName as keyof typeof workList].requiredShifts
                ) {
                    data.work.name = jobName;

                    data.work.salary!.top =
                        workList[jobName as keyof typeof workList].salary;
                    data.work.salary!.bottom =
                        data.work.salary!.top -
                        Math.floor(Math.random() * 100) - 700;

                    const workName = jobName
                        .split('-')
                        .map(
                            (val) =>
                                val.at(0)!.toUpperCase() +
                                val.slice(1, val.length)
                        )
                        .join(' ');

                    data.save();

                    await interaction.reply({
                        content: `Working as ${workName}!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content:
                            "You don't have enough shifts required to apply for this job.",
                        ephemeral: true
                    });

                    return;
                }
            }
        }

        if (interaction.options.getSubcommand() === 'list') {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: (interaction.member! as GuildMember)
                                .displayName,
                            iconURL: (
                                interaction.member! as GuildMember
                            ).displayAvatarURL()
                        })
                        .setTitle('List of jobs you can work at.')
                        .addFields(
                            {
                                name: 'Engineer',
                                value: 'Salary: 5000\nRequired Shifts: 2'
                            },
                            {
                                name: 'Doctor',
                                value: 'Salary: 7500\nRequired Shifts: 6'
                            },
                            {
                                name: 'Pilot',
                                value: 'Salary: 7750\nRequired Shifts: 5'
                            },
                            {
                                name: 'Discord Mod',
                                value: 'Salary: 3000\nRequired Shifts: 0'
                            },
                            {
                                name: 'Youtuber',
                                value: 'Salary: 8000\nRequired Shifts: 15'
                            }
                        )
                        .setColor('Blurple')
                ]
            });
        }

        if (interaction.options.getSubcommand() === 'resign') {
            const data = (await User.findOne({ id: interaction.user.id }))!;

            if (!data.work) {
                await interaction.reply({
                    content:
                        "You currently don't have a job to work at. You can't resign from a job you don't have!",
                    ephemeral: true
                });

                return;
            }

            data.work.name = 'None';
            data.work.salary = {
                top: 0,
                bottom: 0
            };
            data.save();

            await interaction.reply({
                content: 'You have successfully resigned from your job.'
            });
        }

        if (interaction.options.getSubcommand() === 'info') {
            const data = (await User.findOne({ id: interaction.user.id }))!;

            const workName = (data.work?.name || 'None')
                .split('-')
                .map(
                    (val) => val.at(0)!.toUpperCase() + val.slice(1, val.length)
                )
                .join(' ');

            const salary =
                data.work!.salary!.top > 0
                    ? `${data.work?.salary?.bottom} - ${data.work?.salary?.top}`
                    : 'No job.';

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: (interaction.member! as GuildMember).displayName,
                    iconURL: (
                        interaction.member! as GuildMember
                    ).displayAvatarURL()
                })
                .setTitle('Career Information')
                .addFields(
                    {
                        name: 'Work',
                        value: workName
                    },
                    {
                        name: 'Shifts',
                        value: `**${data.work?.shifts}**`
                    },
                    {
                        name: 'Salary Range',
                        value: `**${salary}**`
                    }
                )
                .setColor('Blurple');

            await interaction.reply({
                embeds: [embed]
            });
        }
    }
} as SlashCommand;
