import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../classes';
import User from '../../Schemas/UserSchema';

export default {
    name: 'deposit',
    description: 'Deposit the money you have in the wallet.',
    category: 'ECONOMY',

    options: [
        {
            name: 'amount',
            description: 'The amount of money you want to deposit to the bank.',
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
                    'The amount entered is not applicable. Please enter a number that is GREATER THAN 0.',
                ephemeral: true
            });

            return;
        }

        if (amt > data.wallet) {
            await interaction.reply({
                content:
                    "You don't have that much money in your wallet. Try `/balance` to check the amount of money you have on you.",
                ephemeral: true
            });

            return;
        }

        data.wallet -= amt;
        data.bank += amt;

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
