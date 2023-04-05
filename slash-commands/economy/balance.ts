import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../handler';
import User from '../../Schemas/UserSchema';

export default {
    name: 'balance',
    category: 'ECONOMY',
    description: "Get yours or someone else's balance.",

    options: [
        {
            name: 'target',
            description: 'The person whose balance you want to know.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    callback: async ({ interaction }) => {
        const target =
            interaction.options.get('target')?.user || interaction.user;

        const targetData = await User.findOne({ id: target.id });

        if (!targetData) {
            await interaction.reply({
                content:
                    "You haven't started playing. Use `/start` to start playing!"
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: target.username,
                iconURL: target.displayAvatarURL()
            })
            .setTitle(`Balance of ${target.username}`)
            .addFields([
                {
                    name: 'Wallet',
                    value: `** \` ${targetData.wallet} \` **`,
                    inline: true
                },
                {
                    name: 'Bank',
                    value: `** \` ${targetData.bank} \` **`,
                    inline: true
                }
            ]);

        await interaction.reply({
            embeds: [embed]
        });
    }
} as SlashCommand;
