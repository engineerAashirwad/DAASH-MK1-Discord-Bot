import { Events, MessageFlags } from "discord.js"

export default {
    eventName: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) { // Guard for Only handling Slash Commands.
            return;
        }

        const command = interaction.client.commands.get(interaction.commandName); // Get the command name and check if it exists in the "commands" collection.
        if (!command) {
            console.error(`No Command matching ${interaction.commandName} was Found!`);
            return;
        }

        try {
            await command.execute(interaction);  // After finding the command, call the command's .execute() Method with "interaction" Object passed as argument.
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral,
                });
            }
            else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};