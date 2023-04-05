import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../handler';
import User from '../../Schemas/UserSchema';

export default {
    name: 'withdraw',
    description: 'Withdraw some money from your bank account.',
    category: 'ECONOMY',

    options: [
        {
            name: 'amount',
            description:
                'The amount of money you want to withdraw from the bank.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    callback: async ({ interaction }) => {
        const data = await User.findOne({ id: interaction.user.id });

        if (!data) {
            await interaction.reply({
                content:
                    "You haven't started playing yet! Type `/start` to create an account."
            });

            return;
        }

        const amt = interaction.options.getInteger('amount', true);

        if (amt <= 0) {
            await interaction.reply({
                content:
                    'Number is not applicable. Please enter a number ABOVE 0',
                ephemeral: true
            });

            return;
        }

        if (amt > data.bank) {
            await interaction.reply({
                content:
                    "You don't have that much money in your bank account. Try `/balance` to check the amount of money you have in your bank.",
                ephemeral: true
            });

            return;
        }

        data.wallet += amt;
        data.bank -= amt;

        data.save();

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTitle(`Balance of ${interaction.user.username}`)
            .addFields([
                {
                    name: 'Wallet',
                    value: `** \` ${data.wallet} \` **`,
                    inline: true
                },
                {
                    name: 'Bank',
                    value: `** \` ${data.bank} \` **`,
                    inline: true
                }
            ]);

        await interaction.reply({
            content: `Success 🟩!`,
            embeds: [embed]
        });
    }
} as SlashCommand;
