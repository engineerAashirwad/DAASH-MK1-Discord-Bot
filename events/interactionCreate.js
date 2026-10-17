import { Collection, Events, MessageFlags } from "discord.js"

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

        // Implemented the Cooldown system for spam protection.
        const {cooldowns} = interaction.client;

        if(!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 2.5;
        const cooldownTime = (command.cooldown ?? defaultCooldownDuration) * 1000;

        if(timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownTime;

            if(now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
                    content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownTime);

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