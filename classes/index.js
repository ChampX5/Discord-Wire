const { Collection } = require('discord.js');
const path = require('path');
const { readdirSync } = require('fs');
const AsciiTable = require('ascii-table');

class HandleBot {
    constructor(options) {
        this.client = options.client;
        this.defaultPrefix = options.defaultPrefix;

        this.toAdd = [];

        this.variables = {};

        this.commandTable = new AsciiTable('Slash Commands');
        this.buttonTable = new AsciiTable('Buttons');
        this.contextMenuTable = new AsciiTable('Context Menus');
        this.eventTable = new AsciiTable('Events');
        this.selectMenuTable = new AsciiTable('Select Menus');

        this.commandTable.setHeading('Name', 'Category', 'Status');
        this.contextMenuTable.setHeading('Name', 'Status');
        this.buttonTable.setHeading('Custom ID', 'Status');
        this.eventTable.setHeading('Name', 'Status');
        this.selectMenuTable.setHeading('Name', 'Status');

        this.commands = new Collection();
        this.contextMenus = new Collection();
        this.buttons = new Collection();
        this.selectMenus = new Collection();

        this.separator = path.sep;

        this.client.once('ready', () => {
            if (options.handleSlashCommands) {
                if (!options.slashCommandsDir) {
                    console.log('[CODE] No command folder directory provided.');
                    return;
                }

                if (options.typescript) {
                    this.handleSlashCommands(options.slashCommandsDir, 'ts');
                } else {
                    this.handleSlashCommands(options.slashCommandsDir, 'js');
                }

                this.commands.set('prefix', {
                    name: 'prefix',
                    description: 'Want to know the prefix? Well!',
                    category: 'MISC',
                    callback: async ({ interaction, guild }) => {
                        const prefix =
                            require(options.customPrefixesPath.toString())[
                                guild.id
                            ];
                        if (!prefix) {
                            await interaction.reply({
                                content: `The prefix is: ${this.defaultPrefix}`
                            });
                        } else {
                            await interaction.reply({
                                content: `The prefix is: ${prefix}`
                            });
                        }
                    }
                });
            }

            if (options.handleSelectMenus) {
                if (!options.selectMenusDir) {
                    console.log(
                        '[CODE] No select menu directory was provided.'
                    );
                    return;
                }

                if (options.typescript) {
                    this.handleSelectMenus(options.selectMenusDir, 'ts');
                } else {
                    this.handleSelectMenus(options.selectMenusDir, 'js');
                }
            }

            if (options.handleButtons) {
                if (!options.buttonsDir) {
                    console.log(
                        '[CODE] No button folder directory was provided.'
                    );
                    return;
                }

                if (options.typescript) {
                    this.handleButtons(options.buttonsDir, 'ts');
                } else {
                    this.handleButtons(options.buttonsDir, 'js');
                }
            }

            if (options.handleContextMenus) {
                if (!options.contextMenuDir) {
                    console.log('[CODE] No command folder directory provided.');
                    return;
                }

                if (options.typescript) {
                    this.handleContextMenus(options.contextMenuDir, 'ts');
                } else {
                    this.handleContextMenus(options.contextMenuDir, 'js');
                }
            }

            if (Object.keys(options).includes('server')) {
                this.addToServer(options.server);
            } else if (Object.keys(options).includes('servers')) {
                this.addToServers(servers);
            } else {
                this.client.application.commands.set(this.toAdd);
            }

            if (options.handleFeatures) {
                if (!options.featuresDir) {
                    console.log('[CODE] No features directory was provided.');
                    return;
                }
            }
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand()) {
                const command = this.commands.get(interaction.commandName);

                if (!command) {
                    interaction.reply({
                        content: "That command doesn't exist.",
                        ephemeral: true
                    });
                    return;
                }

                command.callback({
                    channel: interaction.channel,
                    client: this.client,
                    guild: interaction.guild,
                    interaction: interaction,
                    invitePermissions: options.permissionsForInvite,
                    member: interaction.member,
                    user: interaction.user,
                    instance: this,
                    variables: this.variables
                });
            }

            if (interaction.isContextMenu()) {
                const contextMenu = this.contextMenus.get(
                    interaction.commandName
                );

                if (!contextMenu) {
                    interaction.reply({
                        content:
                            'That context menu application does not exist.',
                        ephemeral: true
                    });
                    return;
                }

                contextMenu.callback({
                    client: this.client,
                    guild: interaction.guild,
                    interaction: interaction,
                    invitePermissions: options.permissionsForInvite,
                    member: interaction.member,
                    user: interaction.user,
                    instance: this,
                    variables: this.variables
                });
            }

            if (interaction.isButton()) {
                const button = this.buttons.get(interaction.customId);

                if (!button) {
                    await interaction.reply({
                        content: 'No code found!',
                        ephemeral: true
                    });

                    return;
                }

                button.callback({
                    interaction: interaction,
                    member: interaction.member,
                    user: interaction.user,
                    guild: interaction.guild,
                    client: this.client,
                    invitePermissions: options.permissionsForInvite,
                    instance: this,
                    variables: this.variables
                });
            }

            if (interaction.isSelectMenu()) {
                const { values, guild, member, user, channel, customId } =
                    interaction;

                const selectMenu = this.selectMenus.get(customId);

                if (!selectMenu) {
                    console.log('[CODE] No code was found.');

                    await interaction.reply({
                        content: `No code was found for the following custom ID: ${customId}`,
                        ephemeral: true
                    });

                    return;
                }

                selectMenu.callback({
                    interaction: interaction,
                    member: member,
                    user: user,
                    guild: guild,
                    client: this.client,
                    invitePermissions: options.permissionsForInvite,
                    instance: this,
                    values: values,
                    channel: channel,
                    variables: this.variables
                });
            }
        });

        if (options.handleEvents) {
            if (!options.eventsDir) {
                console.log('[CODE] No folder for events was provided.');
                return;
            }

            if (options.typescript) {
                this.handleEvents(options.eventsDir, 'ts');
            } else {
                this.handleEvents(options.eventsDir, 'js');
            }
        }
    }

    filter(files, type, path) {
        let commands = [];

        for (const file of files) {
            if (file.isDirectory()) {
                commands = [
                    ...commands,
                    ...this.filter(
                        readdirSync(`${path}${this.separator}${file.name}`, {
                            withFileTypes: true
                        }),
                        type,
                        `${path}${this.separator}${file.name}`
                    )
                ];
            } else if (file.name.endsWith(`.${type}`)) {
                commands.push(`${path}${this.separator}${file.name}`);
            }
        }

        return commands;
    }

    addToServer(server) {
        const guild = this.client.guilds.cache.get(server);

        if (!guild) {
            console.log(
                `[CODE] Server ID: ${server} is invalid. Please pass in a server that exists AND make sure the bot is a member of that server.`
            );
            return;
        } else {
            guild.commands.set([]);
            guild.commands.set(this.toAdd);

            console.log(
                `[CODE] Commands have been added to the server with the ID: ${guild.id} and the name: ${guild.name}`
            );
        }

        console.log();
    }

    addToServers(servers) {
        for (const server of servers) {
            const guild = this.client.guilds.cache.get(server);

            if (!guild) {
                console.log(
                    `[CODE] Server ID: ${server} is invalid. Please pass in a server that exists AND make sure the bot is a member of that server.`
                );
                return;
            } else {
                guild.commands.set([]);
                guild.commands.set(this.toAdd);

                console.log(
                    `[CODE] Commands have been added to the server with the ID: ${guild.id} and the name: ${guild.name}`
                );
            }
        }

        console.log();
    }

    handleButtons(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        for (const file of files) {
            const button = require(file.slice(0, file.length - 3)).default;

            this.buttonTable.addRow(button.customId, '🟩 SUCCESS');
            this.buttons.set(button.customId, button);
        }

        if (files.length !== 0) {
            console.log(this.buttonTable.toString());
            console.log();
        } else {
            console.log('No buttons were provided.');
            console.log();
        }
    }

    handleSlashCommands(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        for (const file of files) {
            const command = require(file.slice(0, file.length - 3)).default;
            this.commandTable.addRow(
                command.name,
                command.category,
                '🟩 SUCCESS'
            );
            this.toAdd.push(command);
            this.commands.set(command.name, command);
        }

        if (files.length !== 0) {
            console.log(this.commandTable.toString());
            console.log();
        } else {
            console.log('No slash commands were provided.');
            console.log();
        }
    }

    handleContextMenus(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        for (const file of files) {
            const contextMenu = require(file.slice(0, file.length - 3)).default;
            this.contextMenuTable.addRow(contextMenu.name, '🟩 SUCCESS');
            this.toAdd.push(contextMenu);
            this.contextMenus.set(contextMenu.name, contextMenu);
        }

        if (files.length !== 0) {
            console.log(this.contextMenuTable.toString());
            console.log();
        } else {
            console.log('No context menus were provided.');
            console.log();
        }
    }

    handleEvents(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        for (const file of files) {
            const event = require(file.slice(0, file.length - 3)).default;

            this.eventTable.addRow(event.name, '🟩 SUCCESS');

            if (!event.once) {
                this.client.on(event.name, (...args) => {
                    event.callback(
                        { client: this.client, instance: this },
                        ...args
                    );
                });
            } else {
                this.client.once(event.name, (...args) => {
                    event.callback(
                        { client: this.client, instance: this },
                        ...args
                    );
                });
            }
        }

        if (files.length !== 0) {
            console.log(this.eventTable.toString());
            console.log();
        } else {
            console.log('No events were provided.');
            console.log();
        }
    }

    handleSelectMenus(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        for (const file of files) {
            const menu = require(file.slice(0, file.length - 3)).default;

            this.selectMenuTable.addRow(menu.customId, '🟩 SUCCESS');
            this.selectMenus.set(menu.customId, menu);
        }

        if (files.length !== 0) {
            console.log(this.selectMenuTable.toString());
            console.log();
        } else {
            console.log('No select menus were provided.');
            console.log();
        }
    }
}

module.exports = HandleBot;
