import { SlashCommandBuilder } from "discord.js"

export default {
    cooldown: 5,
    data: new SlashCommandBuilder().setName("server").setDescription("Provides information about the server."),

    async execute(interaction) {
        await interaction.reply(`This Server is **${interaction.guild.name}** and has **${interaction.guild.memberCount}** members.`);  // interaction.guild is the Object of the Guild in which the command was run.
    },
};