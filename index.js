import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import {pathToFileURL} from "node:url"
import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js"  // Importing necessary classes from the Library

const BOT_TOKEN = process.env.BOT_TOKEN;

// Creating the Client Instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When Client is Logged in and Ready, run the below callback.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(import.meta.dirname, "commands"); // In ES Modules "__dirname" is not supported natively, instead import.meta.dirname is used and is natively supported.

const commandFolders = fs.readdirSync(foldersPath);  // Returns an Array of all the Folders/Files in the path passed as the argument.

// A Dynamic Command Handler that dynamically reads command files and sets them in the client.commands Collection.
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);  // Every current folder in the iterration gets a path of its location.
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileURL = pathToFileURL(filePath).href;  // Converting the path starting with drive letter "C:" into a proper "file://" URL
        const { default: command } = await import(fileURL);  // Dynamic Import, returns the whole Module Object containing all the named and the default Exports. The default export is the value of a property named "default" inside the Module Object.

        if ("data" in command && "execute" in command) {  // Checks if "data" and "execute" exist in "command" Object. True even if falsy.
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {    // Guard for Only handling Slash Commands.
        return;
    }

    const command = interaction.client.commands.get(interaction.commandName); // Get the command name and check if it exists in the "commands" collection.
    if (!command) {
        console.error(`No Command matching ${interaction.commandName} was Found!`);
        return;
    }

    try {
        await command.execute(interaction);  // After finding the command, call the command's .execute() Method with "interaction" Object passed as argument.
    } catch (error){
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

    console.log(interaction);
});


client.login(BOT_TOKEN);

