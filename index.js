import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js"  // Importing necessary classes from the Library

const BOT_TOKEN = process.env.BOT_TOKEN;

// Creating the Client Instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(import.meta.dirname, "commands"); // In ES Modules "__dirname" is not supported natively, instead import.meta.dirname is used and is natively supported.

const commandFolders = fs.readdirSync(foldersPath);  // Returns an Array of all the Folders/Files in the path passed as the argument.


for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);  // Every current folder in the iterration gets a path of its location.
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const { default: command } = await import(filePath);

        if ("data" in command && "execute" in command) {  // Checks if "data" and "execute" exist in "command" Object. True even if falsy.
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    console.log(interaction);
});


client.login(BOT_TOKEN);

