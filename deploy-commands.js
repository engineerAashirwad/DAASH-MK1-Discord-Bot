import "dotenv/config"
import { REST, Routes } from "discord.js"
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [];  // Array that will contain .toJSON() outputs of all the command's data.

// Just Like index.js Startup File, Grab the Command Folders Dynamically from the commands Folder.
const foldersPath = path.join(import.meta.dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));  // Grab the Command Files. Filter the array so it only contains JS files.

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileURL = pathToFileURL(filePath).href;
        const { default: command } = await import(fileURL);

        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());   // Run .toJSON() method of SlashCommandBuilder Class on each of its instance called "data" in the "command" Object. And get the output for Deployment.
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct an instance of the REST module.
const rest = new REST().setToken(BOT_TOKEN);

// Deploying the Commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application slash (/) commands.`);

        // The put request method is used to fully refresh/replace all commands in the Guild with the current set.
        const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

        console.log(`Successfully reloaded ${data.length} application slash (/) commands.`);

    } catch (error) {
        console.error(error);
    }
})();


