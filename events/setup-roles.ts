import { GuildMemberRoleManager } from 'discord.js';
import { Event } from '../handler';
import RolesSelector from '../Schemas/RolesSelectorSchema';

export default {
    name: 'interactionCreate',
    once: false,

    callback: async ({}, interaction) => {
        if (interaction.isStringSelectMenu()) {
            const selector = await RolesSelector.findOne({
                customId: `${interaction.guild}-${interaction.customId}`
            });

            if (!selector) return; // not related to custom roles

            selector.roles.forEach((role) => {
                (interaction.member?.roles as GuildMemberRoleManager).remove(
                    role.roleId
                );
            }); // remove the roles to start fresh

            interaction.values.forEach((roleId) => {
                (interaction.member?.roles as GuildMemberRoleManager).add(
                    roleId
                );
            }); // add the selected roles

            await interaction.reply({
                content: `Roles updated!`,
                ephemeral: true
            });
        } else {
            return;
        }
    }
} as Event<'interactionCreate'>;
