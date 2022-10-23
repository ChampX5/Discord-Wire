import { Button } from '../../classes';
import User from '../../Schemas/UserSchema';

export default {
    customId: 'eco-delete',
    
    callback: async ({ interaction }) => {
        await User.deleteOne({ id: interaction.user.id });

        await interaction.reply({
            content:
                'Successfully deleted your account. If you want to start, be sure to use `/start` again!'
        });
    }
} as Button;
