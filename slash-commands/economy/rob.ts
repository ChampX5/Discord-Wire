import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../../handler";
import User from '../../Schemas/UserSchema';

export default {
    name: 'rob',
    description: 'Rob another person!',
    category: 'ECONOMY',

    options: [
        {
            name: 'target',
            description: 'The person you want to rob.',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    callback: async ({ interaction }) => {
        const target = interaction.options.getUser('target', true);

        const data = await User.findOne({ id: interaction.user.id });
        const targetData = await User.findOne({ id: target.id });

        if (!data) {
            await interaction.reply({
                content: 'You haven\'t started an account tracking your economic progress.',
                ephemeral: true
            });

            return;
        }

        if (target.id === interaction.user.id) {
            await interaction.reply({
                content: 'You can\'t rob yourself.',
            });

            return;
        }

        if (!targetData) {
            await interaction.reply({
                content: 'Specified person does not have an account associated to them.',
                ephemeral: true
            });

            return;
        }

        let rob: boolean;

        if (Math.floor(Math.random() * 10) > 8) {
            rob = true;
        } else {
            rob = false;
        }

        if (targetData.wallet < 1000) {
            await interaction.reply({
                content: 'They have very less money in their wallet. No use robbing them.',
                ephemeral: true
            });

            return;
        }

        if (rob) {
            const robMoney = Math.floor(Math.random() * 500);

            targetData.wallet -= robMoney;
            data.wallet += robMoney;

            targetData.save();
            data.save();

            await interaction.reply({
                content: `You stole ${robMoney} 🪙 from <@${target.id}>!`
            });

            await (await target.createDM(true)).send({
                content: `<@${interaction.user.id}> robbed ${robMoney} 🪙 from you. Now's your chance, go take your revenge!`
            });
        } else {
            await interaction.reply({
                content: `<@${target.id}> saw you coming and elegantly avoided you.`
            });
        }
    }
} as SlashCommand;