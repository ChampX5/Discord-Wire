import { Button } from '../../handler';

export default {
    customId: 'eco-noDelete',

    callback: async ({ interaction }) => {
        await interaction.reply({
            content: 'Nice!'
        });
    }
} as Button;
