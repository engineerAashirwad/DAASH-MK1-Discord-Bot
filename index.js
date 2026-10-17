import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { Client, Collection, GatewayIntentBits } from "discord.js"  // Importing necessary classes from the Library

const BOT_TOKEN = process.env.BOT_TOKEN;

// Creating the Client Instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

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

// Dynamically retrieving all the event files from the events folder, similar to how I made the Command handler, I made this Event Handler.
const eventsPath = path.join(import.meta.dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const fileURL = pathToFileURL(filePath).href;
    const {default: event} = await import(fileURL);
    // Loading each event listener individually and attaching .on() or .once() listener according to the event being handled.
    if(event.once) {
        client.once(event.eventName, (...args) => {
            event.execute(...args);
        });
    }
    else {
        client.on(event.eventName, (...args) => {
            event.execute(...args);
        });
    }
}

client.login(BOT_TOKEN);

