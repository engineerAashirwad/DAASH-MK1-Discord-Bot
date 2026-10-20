import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

const data = new SlashCommandBuilder().setName("ban").setDescription("Select a member and ban them.")
    .addUserOption((option) => option.setName("target").setDescription("The member to ban.").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for banning."))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).setContexts(InteractionContextType.Guild);

export default {
    cooldown: 20,
    data,   // Object Property Shorthand. Is exactly the same as "data: data,"
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "No reason provided.";

        await interaction.reply(`Banning <@${target.id}> for reason: ${reason}`);
        await interaction.guild.members.ban(target, {reason});
    },
};