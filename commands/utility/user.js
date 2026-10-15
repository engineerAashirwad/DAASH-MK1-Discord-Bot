import { SlashCommandBuilder } from "discord.js"

export default {
    data: new SlashCommandBuilder().setName("user").setDescription("Provides information about the user."),

    async execute(interaction) {
        await interaction.reply(`This Command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);  // interaction.user is the object of the User who ran the Command. And interaction.member is the GuildMember Object, which represents the User in the specific Guild.
    },
};