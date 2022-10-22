import { SlashCommand } from '../../classes';
import User from '../../Schemas/UserSchema';

export default {
    name: 'start',
    category: 'ECONOMY',
    description: 'Start playing with economy commands. Create an account!',

    callback: async ({ interaction }) => {
        const data = await User.findOne({ id: interaction.user.id });

        if (!data) {
            new User({ id: interaction.user.id, work: null }).save();

            await interaction.reply({
                content:
                    'Created an account for you! Use `/balance` to check your balance!'
            });
        } else {
            await interaction.reply({
                content:
                    'You are already playing the game. Use `/balance` to check your progress!'
            });
        }
    }
} as SlashCommand;
