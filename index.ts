import path from 'path';
import { Client, Intents } from 'discord.js';
import HandleBot from './classes';
import 'dotenv/config';

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS
	]
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

	eventsDir: path.join(__dirname, 'events'),
	featuresDir: path.join(__dirname, 'features'),
	slashCommandsDir: path.join(__dirname, 'slash-commands'),
	contextMenuDir: path.join(__dirname, 'context-menus'),
	buttonsDir: path.join(__dirname, 'buttons'),
	selectMenusDir: path.join(__dirname, 'menus'),

	typescript: true,
	server: '914743921219878953',
	permissionsForInvite: [
		'KICK_MEMBERS',
		'BAN_MEMBERS',
		'MODERATE_MEMBERS',
		'SEND_MESSAGES',
		'ADD_REACTIONS',
		'READ_MESSAGE_HISTORY'
	]
});

client.login(process.env.TOKEN);
