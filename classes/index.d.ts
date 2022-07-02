import {
    Client,
    PermissionString,
    ContextMenuInteraction,
    User,
    Guild,
    GuildMember,
    CommandInteraction,
    TextBasedChannel,
    Message,
    ButtonInteraction,
    ApplicationCommandOptionData,
    SelectMenuInteraction,
    ClientEvents,
    Collection
} from 'discord.js';
import { PathLike, Dirent } from 'fs';

interface SelectMenuCallbackObject {
    interaction: SelectMenuInteraction;
    member: GuildMember;
    user: User;
    guild: Guild;
    channel: TextBasedChannel;
    client: Client;
    invitePermissions: PermissionString[];
    instance: HandleBot;
    values: string[];
    variables: Collection<string, any>;
}

interface EventCallbackObject {
    client: Client;
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface ButtonCallbackObject {
    interaction: ButtonInteraction;
    member: GuildMember;
    user: User;
    guild: Guild;
    client: Client;
    invitePermissions: PermissionString[];
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface SlashCommandCallbackObject {
    interaction: CommandInteraction;
    member: GuildMember;
    user: User;
    channel: TextBasedChannel;
    guild: Guild;
    client: Client;
    invitePermissions: PermissionString[];
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface ContextMenuCallbackObject {
    interaction: ContextMenuInteraction;
    member: GuildMember;
    user: User;
    guild: Guild;
    client: Client;
    invitePermissions: PermissionString[];
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface ConstructorOptionsSingleServer {
    client: Client;

    handleSlashCommands: boolean;
    handleEvents: boolean;
    handleFeatures: boolean;
    handleContextMenus: boolean;
    handleButtons: boolean;
    handleMenus: boolean;
    handleSelectMenus: boolean;

    slashCommandsDir?: PathLike;
    eventsDir?: PathLike;
    featuresDir?: PathLike;
    contextMenuDir?: PathLike;
    buttonsDir?: PathLike;
    selectMenusDir?: PathLike;

    typescript: boolean;

    server: string;
    permissionsForInvite: PermissionString[];
}

interface ConstructorOptionsGlobal {
    client: Client;

    handleSlashCommands: boolean;
    handleEvents: boolean;
    handleFeatures: boolean;
    handleContextMenus: boolean;
    handleButtons: boolean;
    handleMenus: boolean;
    handleSelectMenus: boolean;

    slashCommandsDir?: PathLike;
    eventsDir?: PathLike;
    featuresDir?: PathLike;
    contextMenuDir?: PathLike;
    buttonsDir?: PathLike;
    selectMenusDir?: PathLike;

    typescript: boolean;
    permissionsForInvite: PermissionString[];
}

interface ConstructorOptionsMultipleServers {
    client: Client;

    handleSlashCommands: boolean;
    handleEvents: boolean;
    handleFeatures: boolean;
    handleContextMenus: boolean;
    handleButtons: boolean;
    handleMenus: boolean;
    handleSelectMenus: boolean;

    slashCommandsDir?: PathLike;
    eventsDir?: PathLike;
    featuresDir?: PathLike;
    contextMenuDir?: PathLike;
    buttonsDir?: PathLike;
    selectMenusDir?: PathLike;

    typescript: boolean;

    servers: string[];
    permissionsForInvite: PermissionString[];
}

export default class HandleBot {
    client: Client;

    toAdd: Array<SlashCommand | ContextMenu> = [];

    private variables: Collection<string, any>;

    commands: Collection<string, SlashCommand>;

    contextMenus: Collection<string, ContextMenu>;
    buttons: Collection<string, Button>;
    selectMenus: Collection<string, SelectMenu>;

    private slashCommandTable;
    private eventTable;
    private contextMenuTable;
    private selectMenuTable;

    private separator: string;

    constructor(
        options:
            | ConstructorOptionsSingleServer
            | ConstructorOptionsMultipleServers
            | ConstructorOptionsGlobal
    );

    private filter(files: Dirent[], type: 'ts' | 'js', path: PathLike);

    private addToServer(server: string);
    private addToServers(server: string[]);

    private handleSlashCommands(directory: PathLike, type: 'ts' | 'js');
    private handleContextMenus(directory: PathLike, type: 'ts' | 'js');
    private handleEvents(directory: PathLike, type: 'ts' | 'js');
    private handleSelectMenus(directory: PathLike, type: 'ts' | 'js');
}

export interface SlashCommand {
    name: string;
    category?: string;
    description: string;

    permissions?: PermissionString[];
    defaultPermission?: boolean;
    options?: ApplicationCommandOptionData[];

    callback(obj: SlashCommandCallbackObject): void;
}

export interface ContextMenu {
    name: string;
    type: 'USER' | 'MESSAGE';

    callback(obj: ContextMenuCallbackObject): void;
}

export interface Event<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;

    callback(obj: EventCallbackObject, ...args: ClientEvents[K]): void;
}

export interface Button {
    customId: string;
    callback(obj: ButtonCallbackObject): void;
}

export interface SelectMenu {
    customId: string;

    callback(obj: SelectMenuCallbackObject): void;
}
