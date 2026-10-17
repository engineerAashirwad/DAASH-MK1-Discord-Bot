import { SlashCommandBuilder } from "discord.js"

export default {
    cooldown: 5,
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with 'Pong!'"),

    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};