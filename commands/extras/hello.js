import { SlashCommandBuilder } from "discord.js"

export default {
    data: new SlashCommandBuilder().setName("hello").setDescription("Greets the User with 'Hello'."),

    async execute(interaction) {
        await interaction.reply(`Hello ${interaction.user.globalName}. Hope your day is going good.`);
    },
};