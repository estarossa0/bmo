import { Client, Collection } from "discord.js";
import type { Command } from "../types";

const client: Client & { commands?: Collection<string, Command> } = new Client({
  intents: ["DIRECT_MESSAGES", "GUILD_MESSAGES", "GUILDS"],
});

export default client;
