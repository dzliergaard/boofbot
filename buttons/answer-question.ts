import { ButtonInteraction } from "discord.js";
import { answeredCollection, db } from "../firestore";

module.exports = {
    customIdPrefix: 'answer',
    requiredRoles: [
        '722446885423546420',
        '881371527273144330',
        '590690199554752523',
        '590693611151294464',
    ],
    async execute(interaction: ButtonInteraction) {
        const docId = interaction.customId.replace('answer-', '');
        const docRef = db.doc(docId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return await interaction.reply(`Question has already been deleted/moved.`);
        }
        const question = doc.data();

        await answeredCollection.doc().set(question);
        // Delete the original question in unanswered.
        await docRef.delete();

        await interaction.reply(`${interaction.user.username} \`${question.text}\` as answered.`);
    },
};