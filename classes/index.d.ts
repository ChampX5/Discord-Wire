import {
    Client,
    User,
    Guild,
    PermissionsString,
    GuildMember,
    CommandInteraction,
    GuildTextBasedChannel,
    Message,
    ButtonInteraction,
    ApplicationCommandOptionData,
    SelectMenuInteraction,
    ClientEvents,
    Collection,
    SlashCommandOptionsOnlyBuilder,
    GuildTextBasedChannel,
    ContextMenuCommandType,
    ContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    ChatInputCommandInteraction,
    Interaction
} from 'discord.js';
import { PathLike, Dirent } from 'fs';

interface SelectMenuCallbackObject {
    interaction: SelectMenuInteraction;
    member: GuildMember;
    user: User;
    guild: Guild;
    channel: GuildTextBasedChannel;
    client: Client;
    invitePermissions: PermissionsString[];
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
    invitePermissions: PermissionsString[];
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface SlashCommandCallbackObject {
    interaction: ChatInputCommandInteraction;
    member: GuildMember;
    user: User;
    channel: GuildTextBasedChannel;
    guild: Guild;
    client: Client;
    invitePermissions: PermissionsString[];
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface FeaturesCallbackObject {
    client: Client;
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface ContextMenuCallbackObject {
    interaction: ContextMenuCommandInteraction;
    member: GuildMember;
    user: User;
    guild: Guild;
    client: Client;
    invitePermissions: PermissionsString[];
    instance: HandleBot;
    variables: Collection<string, any>;
}

interface ConstructorOptions {
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

    typescript: boolean | 'both';
    permissionsForInvite: PermissionsString[];

    token: string;
    mongoUri?: string;
}

export default class HandleBot {
    client: Client;

    toAdd: Array<SlashCommand | ContextMenu> = [];

    private variables: Collection<string, any>;

    commands: Collection<string, SlashCommand>;
    contextMenus: Collection<string, ContextMenu>;
    selectMenus: Collection<string, SelectMenu>;
    buttons: Collection<string, Button>;

    private slashCommandTable;
    private eventTable;
    private contextMenuTable;
    private selectMenuTable;
    private featuresTable;

    private separator: string;

    constructor(
        options: ConstructorOptions &
            ({ server: string } | { servers: string[] } | {})
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

    permissions?: PermissionsString[];
    defaultPermission?: boolean;
    options?: ApplicationCommandOptionData[];

    callback(obj: SlashCommandCallbackObject): void;
}

export interface ContextMenu {
    name: string;
    type: ContextMenuCommandType;

    callback(obj: ContextMenuCallbackObject): void;
}

export interface Feature {
    name: string;

    run(obj: SlashCommandCallbackObject): void;
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