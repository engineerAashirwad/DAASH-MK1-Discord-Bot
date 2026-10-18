import { SlashCommandBuilder } from "discord.js"

export default {
    cooldown: 5,
    data: new SlashCommandBuilder().setName("hello").setDescription("Greets the User with 'Hello'."),

    async execute(interaction) {
        await interaction.reply(`Hello <@${interaction.user.id}>. Hope your day is going good 😊.`);
    },
};