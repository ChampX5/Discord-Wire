import path from 'path';
import { Client } from 'discord.js';
import HandleBot from './handler';
import 'dotenv/config';

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMembers']
});

new HandleBot({
    client: client,

    handleSlashCommands: true,
    handleContextMenus: true,
    handleEvents: true,
    handleFeatures: false,
    handleButtons: true,
    handleSelectMenus: false,

    eventsDir: path.join(__dirname, './events'),
    slashCommandsDir: path.join(__dirname, './slash-commands'),
    contextMenuDir: path.join(__dirname, './context-menus'),
    buttonsDir: path.join(__dirname, './buttons'),

    typescript: true,
    permissionsForInvite: [
        'ManageRoles',
        'KickMembers',
        'BanMembers',
        'ChangeNickname',
        'ModerateMembers',
        'SendMessages',
        'ManageMessages',
        'UseExternalEmojis'
    ],

    servers: ['914743921219878953'],

    token: process.env.TOKEN! as string,
    mongoUri: process.env.mongoUri! as string
});
