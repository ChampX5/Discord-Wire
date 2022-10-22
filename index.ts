import path from 'path';
import { Client } from 'discord.js';
import HandleBot from './classes';
import 'dotenv/config';

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMembers']
});

new HandleBot({
    client: client,

    handleSlashCommands: true,
    handleContextMenus: true,
    handleEvents: true,
    handleFeatures: true,
    handleButtons: true,
    handleMenus: true,
    handleSelectMenus: true,

    eventsDir: path.join(__dirname, './events'),
    featuresDir: path.join(__dirname, './features'),
    slashCommandsDir: path.join(__dirname, './slash-commands'),
    contextMenuDir: path.join(__dirname, './context-menus'),
    buttonsDir: path.join(__dirname, './buttons'),
    selectMenusDir: path.join(__dirname, './menus'),

    typescript: true,
    server: '914743921219878953',
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
    
    token: process.env.TOKEN! as string,
    mongoUri: process.env.mongoUri! as string
});
