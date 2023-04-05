import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    StringSelectMenuBuilder,
    TextChannel
} from 'discord.js';
import { SlashCommand } from '../../handler';
import RolesSelector from '../../Schemas/RolesSelectorSchema';

export default {
    name: 'roles',
    description:
        'Initialize the setup for the dropdown roles in a given channel.',

    category: 'MOD',

    defaultPermission: false,
    permissions: ['Administrator'],

    options: [
        {
            name: 'setup',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Start the setup for the role selector.',
            options: [
                {
                    name: 'custom_id',
                    type: ApplicationCommandOptionType.String,
                    description:
                        'The custom ID for the dropdown menu. This must be unique for every role selector.',
                    required: true
                }
            ]
        },

        {
            name: 'add',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Add a role to the dropdown options.',
            options: [
                {
                    name: 'custom_id',
                    type: ApplicationCommandOptionType.String,
                    description: 'The custom ID to which you want to add.',
                    required: true
                },
                {
                    name: 'name',
                    type: ApplicationCommandOptionType.String,
                    description:
                        'The name you want to appear in the dropdown selection.',
                    required: true
                },
                {
                    name: 'role',
                    type: ApplicationCommandOptionType.Role,
                    description: 'The role to be added.',
                    required: true
                },
                {
                    name: 'description',
                    type: ApplicationCommandOptionType.String,
                    description:
                        'The description of the role that will be shown to the users.',
                    required: false
                },
                {
                    name: 'emoji',
                    type: ApplicationCommandOptionType.String,
                    description:
                        'The emoji that you want to be shown to the users.',
                    required: false
                }
            ]
        },

        {
            name: 'custom',
            type: ApplicationCommandOptionType.Subcommand,
            description:
                'Setup a custom message(s) to be sent before the actual role selector. Input in correct order.',
            options: [
                {
                    name: 'custom_id',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description:
                        'The custom ID of the role selector you want to edit.'
                },
                {
                    name: 'message',
                    description:
                        'The message you want to be sent before the role selector. (Send images through a link.)',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },

        {
            name: 'send',
            type: ApplicationCommandOptionType.Subcommand,
            description:
                'Send the FINAL message with the dropdown selector. BE CAREFUL!',
            options: [
                {
                    name: 'custom_id',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description:
                        'The custom ID of the role selector you want to send.'
                },
                {
                    name: 'channel',
                    type: ApplicationCommandOptionType.Channel,
                    description:
                        'The channel you want to send the dropdown role selector.',
                    required: true
                }
            ]
        },

        {
            name: 'remove',
            type: ApplicationCommandOptionType.Subcommand,
            description:
                'Remove an already added role from the dropdown options.',
            options: [
                {
                    name: 'custom_id',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    description:
                        'The custom ID of the role selector you want to edit.'
                },
                {
                    name: 'role',
                    type: ApplicationCommandOptionType.Role,
                    description: 'The role to be removed.',
                    required: true
                }
            ]
        },

        {
            name: 'view-roles',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Confused of the roles? Have a look at them!',
            options: [
                {
                    name: 'custom_id',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description:
                        'The custom ID of the role selector you want to see.'
                }
            ]
        },

        {
            name: 'preview',
            type: ApplicationCommandOptionType.Subcommand,
            description:
                'Have a look of what the final role selector will look like!',
            options: [
                {
                    name: 'custom_id',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description:
                        'The custom ID of the role selector you want to see.'
                },
                {
                    name: 'channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    description:
                        'The channel you want the selector to be sent in.'
                }
            ]
        }
    ],

    callback: async ({ interaction, guild, member }) => {
        const subcommand = interaction.options.getSubcommand();
        const customId = interaction.options.getString('custom_id', true);

        if (subcommand === 'setup') {
            if (await RolesSelector.findOne({ customId: customId })) {
                await interaction.reply({
                    content: `A custom role selector with custom ID: ${customId} already exists.`,
                    ephemeral: true
                });

                return;
            }

            const selector = new RolesSelector({
                customId: `${guild.id}-${customId}`,
                roles: []
            });

            await selector.save();

            await interaction.reply({
                content: `Successfully setup a role selector with the custom ID: ${customId}`,
                ephemeral: true
            });
        } else {
            const selector = await RolesSelector.findOne({
                customId: `${guild.id}-${customId}`
            });

            if (!selector) {
                await interaction.reply({
                    content: `No such role selector with custom ID: ${customId}`,
                    ephemeral: true
                });

                return;
            }

            if (subcommand === 'custom') {
                const newMessage = interaction.options.getString(
                    'message',
                    true
                );

                selector.messages.push(newMessage);

                await selector.save();

                await interaction.reply({
                    content: `Successfully added custom message: ${newMessage} to selector with custom ID: ${customId}`,
                    ephemeral: true
                });
            } else if (subcommand === 'add') {
                const role = interaction.options.getRole('role', true);
                const name = interaction.options.getString('name', true);
                const description =
                    interaction.options.getString('description') || undefined;
                const emoji =
                    interaction.options.getString('emoji') || undefined;

                selector.roles.push({
                    roleId: role.id,
                    name: name,
                    description: description,
                    emoji: emoji
                });

                await selector.save();

                await interaction.reply({
                    content: `Added role: <@&${role.id}> to selector with custom ID: ${customId}`,
                    ephemeral: true
                });
            } else if (subcommand === 'remove') {
                const role = interaction.options.getRole('role', true);

                const roleIds = selector.roles.map((role) => role.roleId);

                if (roleIds.find((roleId) => roleId === role.id)) {
                    selector.roles.splice(roleIds.indexOf(role.id), 1);

                    await selector.save();

                    await interaction.reply({
                        content: `Successfully removed role: <@&${role.id}> from selector with custom ID: ${customId}`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Could not find a role associated to selector with custom ID: ${customId}`,
                        ephemeral: true
                    });
                }
            } else if (subcommand === 'preview') {
                if (selector.roles.length === 0) {
                    await interaction.reply({
                        content:
                            'Add some roles to the dropdown in order to send the role selection dropdown.',
                        ephemeral: true
                    });

                    return;
                }

                const data = selector.roles.map((role) => {
                    return {
                        value: role.roleId,
                        label: role.name,
                        description: role.description,
                        emoji: role.emoji
                    };
                });

                const row =
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(selector.customId)
                            .setMaxValues(selector.roles.length)
                            .setMinValues(0)
                            .setPlaceholder('No roles chosen.')
                            .addOptions(data)
                    );

                const channel = interaction.options.getChannel(
                    'channel',
                    true
                ) as TextChannel;

                if (channel.type !== ChannelType.GuildText) {
                    await interaction.reply({
                        content:
                            'Please mention a text channel where the bot has permission to send messages.',
                        ephemeral: true
                    });

                    return;
                }

                await interaction.reply({
                    content: `Sending preview of role selector dropdown in <#${channel.id}>`,
                    ephemeral: true
                });

                for (const message of selector.messages) {
                    await channel.send(message);
                }

                await channel.send({
                    components: [row]
                });
            } else if (subcommand === 'send') {
                if (selector.roles.length === 0) {
                    await interaction.reply({
                        content:
                            'Add some roles to the dropdown in order to send the role selection dropdown.',
                        ephemeral: true
                    });

                    return;
                }

                const data = selector.roles.map((role) => {
                    return {
                        value: role.roleId,
                        label: role.name,
                        description: role.description,
                        emoji: role.emoji
                    };
                });

                const row =
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(selector.customId)
                            .setMaxValues(selector.roles.length)
                            .setMinValues(0)
                            .setPlaceholder('No roles chosen.')
                            .addOptions(data)
                    );

                const channel = interaction.options.getChannel(
                    'channel',
                    true
                ) as TextChannel;

                if (channel.type !== ChannelType.GuildText) {
                    await interaction.reply({
                        content:
                            'Please mention a text channel where the bot has permission to send messages.',
                        ephemeral: true
                    });

                    return;
                }

                await interaction.reply({
                    content: `Sending the final dropdown selector in <#${channel.id}>`,
                    ephemeral: true
                });

                for (const message of selector.messages) {
                    await channel.send(message);
                }

                await channel.send({
                    components: [row]
                });

                await selector.delete();
            } else if (subcommand === 'view-roles') {
                if (selector.roles.length === 0) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: member.displayName,
                            iconURL: member.displayAvatarURL()
                        })
                        .setTitle(
                            `Error`
                        )
                        .setDescription(
                            'Error: The role selector you are trying access does not have any roles associated to it.'
                        )
                        .setColor('Red');

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });

                    return;
                }

                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: member.displayName,
                        iconURL: member.displayAvatarURL()
                    })
                    .setTitle(`Status of dropdown role selector: ${customId}`)
                    .setDescription(
                        'See the roles and custom messages added to the dropdown.'
                    )
                    .addFields(
                        selector.messages.map((msg) => {
                            return {
                                name: 'Message',
                                value: msg,
                                inline: true
                            };
                        })
                    )
                    .addFields(
                        selector.roles.map((role) => {
                            return {
                                name: 'Role',
                                value: `<@&${role.roleId}>\nName: ${role.name} \nEmoji: ${role.emoji || 'None'}\nDescription: ${role.description || 'None'}`,
                                inline: true
                            };
                        })
                    )
                    .setColor('Green');
                
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        }
    }
} as SlashCommand;
