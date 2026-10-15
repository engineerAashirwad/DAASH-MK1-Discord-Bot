import { SlashCommandBuilder } from "discord.js"

export default {
    data: new SlashCommandBuilder().setName("hello").setDescription("Greets the User."),

    async execute(interaction) {
        await interaction.reply(`Hello ${interaction.user.globalname}. Hope your day is going good.`);
    },
};