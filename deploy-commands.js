import "dotenv/config"
import {REST, Routes} from "discord.js"
import fs from "node:fs"
import path from "node:path"

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [];

// Just Like index.js Startup File, Grab the Command Folders Dynamically from the commands Folder.
const foldersPath = path.join(import.meta.dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));  // Grab the Command Files. Filter the array so it only contains JS files.

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const {default: command} = await import(filePath);

        if("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());   // Run .toJSON() method of SlashCommandBuilder Class on each of its instance called "data" in the "command" Object. And get the output for Deployment.
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


