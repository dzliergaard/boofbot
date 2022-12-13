import { ButtonInteraction } from "discord.js";
import { db } from "../firestore";

module.exports = {
    customIdPrefix: 'delete',
    requiredRoles: [
        '722446885423546420',
        '881371527273144330',
        '590690199554752523',
        '590693611151294464',
    ],
    async execute(interaction: ButtonInteraction) {
        const docId = interaction.customId.replace('delete-', '');
        const docRef = db.doc(docId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return await interaction.reply(`Question has already been deleted/moved.`);
        }
        const question = doc.data();

        await docRef.delete();

        await interaction.reply(`${interaction.user.username} deleted \`${question.text}\` for being a bad question.`)
    },
};