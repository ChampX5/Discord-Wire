const { Collection, InteractionType } = require('discord.js');
const { sep } = require('path');
const { readdirSync } = require('fs');
const AsciiTable = require('ascii-table');
const { connect } = require('mongoose');

class HandleBot {
    constructor(options) {
        this.client = options.client;
        this.defaultPrefix = options.defaultPrefix;

        this.toAdd = [];

        this.variables = new Collection();

        this.commandTable = new AsciiTable('Slash Commands');
        this.buttonTable = new AsciiTable('Buttons');
        this.contextMenuTable = new AsciiTable('Context Menus');
        this.eventTable = new AsciiTable('Events');
        this.selectMenuTable = new AsciiTable('Select Menus');
        this.featuresTable = new AsciiTable('Select Menus');

        this.commandTable.setHeading('Name', 'Category', 'Status');
        this.contextMenuTable.setHeading('Name', 'Status');
        this.buttonTable.setHeading('Custom ID', 'Status');
        this.eventTable.setHeading('Name', 'Status');
        this.selectMenuTable.setHeading('Name', 'Status');
        this.featuresTable.setHeading('Name', 'Status');

        this.commands = new Collection();
        this.contextMenus = new Collection();
        this.buttons = new Collection();
        this.selectMenus = new Collection();

        this.separator = sep;

        this.client.once('ready', () => {
            if (options.handleSlashCommands) {
                if (!options.slashCommandsDir) {
                    console.log('[CODE] No command folder directory provided.');
                    return;
                }

                this.handleSlashCommands(
                    options.slashCommandsDir,
                    options.typescript ? 'ts' : 'js'
                );
            }

            if (options.handleSelectMenus) {
                if (!options.selectMenusDir) {
                    console.log(
                        '[CODE] No select menu directory was provided.'
                    );
                } else {
                    this.handleSelectMenus(
                        options.selectMenusDir,
                        options.typescript ? 'ts' : 'js'
                    );
                }
            }

            if (options.handleButtons) {
                if (!options.buttonsDir) {
                    console.log(
                        '[CODE] No button folder directory was provided.'
                    );
                } else {
                    this.handleButtons(
                        options.buttonsDir,
                        options.typescript ? 'ts' : 'js'
                    );
                }
            }

            if (options.handleContextMenus) {
                if (!options.contextMenuDir) {
                    console.log('[CODE] No command folder directory provided.');
                } else {
                    this.handleContextMenus(
                        options.contextMenuDir,
                        options.typescript ? 'ts' : 'js'
                    );
                }
            }

            if (process.env.DEV) {
                if (Object.keys(options).includes('servers')) {
                    this.addToServers(options.servers);
                } else {
                    this.client.application.commands.set([]);
                    this.client.application.commands.set(this.toAdd);
                }
            }

            if (options.handleFeatures) {
                if (!options.featuresDir) {
                    console.log('[CODE] No features directory was provided.');
                } else {
                    this.handleFeatures(
                        options.featuresDir,
                        options.typescript ? 'ts' : 'js'
                    );
                }
            }
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.type === InteractionType.ApplicationCommand) {
                if (interaction.isChatInputCommand()) {
                    if (options.handleSlashCommands) {
                        const command = this.commands.get(
                            interaction.commandName
                        );

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
                }

                if (interaction.isContextMenuCommand()) {
                    if (options.handleContextMenus) {
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
                }
            }

            if (interaction.isButton()) {
                if (options.handleButtons) {
                    const button = this.buttons.get(interaction.customId);

                    if (!button) {
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
            }

            if (interaction.isAnySelectMenu()) {
                if (options.handleSelectMenus) {
                    const { values, guild, member, user, channel, customId } =
                        interaction;

                    const selectMenu = this.selectMenus.get(customId);

                    if (!selectMenu) {
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
            }
        });

        if (options.handleEvents) {
            if (!options.eventsDir) {
                console.log('[CODE] No folder for events was provided.');
                return;
            }

            this.handleEvents(
                options.eventsDir,
                options.typescript ? 'ts' : 'js'
            );
        }

        if (!options.mongoUri) {
            this.client.login(options.token);
        } else {
            this.client.login(options.token).then(() => {
                connect(options.mongoUri).then(() => {
                    console.log('Connected to MongoDB successfully.');
                });
            });
        }
    }

    filter(files, type, path) {
        let filePaths = [];

        for (const file of files) {
            if (file.isDirectory()) {
                filePaths = [
                    ...filePaths,
                    ...this.filter(
                        readdirSync(`${path}${this.separator}${file.name}`, {
                            withFileTypes: true
                        }),
                        type,
                        `${path}${this.separator}${file.name}`
                    )
                ];
            } else {
                if (type === 'ts') {
                    if (file.name.endsWith(`.ts`))
                        filePaths.push(`${path}${this.separator}${file.name}`);
                } else if (type === 'js') {
                    if (file.name.endsWith(`.${type}`))
                        filePaths.push(`${path}${this.separator}${file.name}`);
                }
            }
        }

        return filePaths;
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

    handleFeatures(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        if (files.length !== 0) {
            for (const file of files) {
                const feature = require(file.slice(0, file.length - 3)).default;

                feature.run({
                    client: this.client,
                    instance: this,
                    variables: this.variables
                });

                this.featuresTable.addRow(feature.customId, '🟩 RUN');
            }

            console.log(this.featuresTable.toString());
            console.log();
        } else {
            console.log('No features were provided.');
            console.log();
        }
    }

    handleButtons(directory, type) {
        const files = this.filter(
            readdirSync(directory, { withFileTypes: true }),
            type,
            directory
        );

        if (files.length !== 0) {
            for (const file of files) {
                const button = require(file.slice(0, file.length - 3)).default;

                this.buttonTable.addRow(button.customId, '🟩 SUCCESS');
                this.buttons.set(button.customId, button);
            }

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

        if (files.length !== 0) {
            for (const file of files) {
                let command;

                if (file.endsWith('.ts')) {
                    command = require(file.slice(0, file.length - 3)).default;
                } else if (file.endsWith('.js')) {
                    command = require(file.slice(0, file.length - 3));
                }

                this.commandTable.addRow(
                    command.name,
                    command.category,
                    '🟩 SUCCESS'
                );
                this.toAdd.push(command);
                this.commands.set(command.name, command);
            }

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

        if (files.length !== 0) {
            for (const file of files) {
                const contextMenu = require(file.slice(
                    0,
                    file.length - 3
                )).default;
                this.contextMenuTable.addRow(contextMenu.name, '🟩 SUCCESS');
                this.toAdd.push(contextMenu);
                this.contextMenus.set(contextMenu.name, contextMenu);
            }

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

        if (files.length !== 0) {
            for (const file of files) {
                const event = require(file.slice(0, file.length - 3)).default;

                this.eventTable.addRow(event.name, '🟩 SUCCESS');

                if (!event.once) {
                    this.client.on(event.name, (...args) => {
                        event.callback(
                            {
                                client: this.client,
                                instance: this,
                                variables: this.variables
                            },
                            ...args
                        );
                    });
                } else {
                    this.client.once(event.name, (...args) => {
                        event.callback(
                            {
                                client: this.client,
                                instance: this,
                                variables: this.variables
                            },
                            ...args
                        );
                    });
                }
            }

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

        if (files.length !== 0) {
            for (const file of files) {
                const menu = require(file.slice(0, file.length - 3)).default;

                this.selectMenuTable.addRow(menu.customId, '🟩 SUCCESS');
                this.selectMenus.set(menu.customId, menu);
            }

            console.log(this.selectMenuTable.toString());
            console.log();
        } else {
            console.log('No select menus were provided.');
            console.log();
        }
    }
}

module.exports = HandleBot;
