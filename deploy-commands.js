import "dotenv/config"
import {REST, Routes} from "discord.js"
import fs from "node:fs"
import path from "node:path"

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [];


