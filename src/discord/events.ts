import {
  ApplicationCommandData,
  Interaction,
  Message,
  Collection,
} from "discord.js";
import type { Command } from "../types";
import getCommands from "../utils/commandsHandler";
import client from "./client";

const messageCreateHandler = async (message: Message): Promise<void> => {
  if (message.author.bot) return;
};

const readyHandler = async (): Promise<void> => {
  const commandsArray: Command[] = await getCommands();
  client.commands = new Collection();

  for (const command of commandsArray)
    client.commands.set(command.name, command);

  const commandsData: ApplicationCommandData[] = commandsArray.map(
    ({ execute, ...data }) => data,
  );

  client.guilds.cache.forEach((guild) => guild.commands.set(commandsData)); // will be replaced with client.application.commands later

  console.log("Bot ready");
};

const interactionCreateHandler = async (
  interaction: Interaction,
): Promise<void> => {
  if (!interaction.isCommand()) return;

  if (!client.commands?.has(interaction.commandName)) return;

  try {
    await client.commands.get(interaction.commandName)?.execute(interaction);
  } catch (err) {
    console.log(err);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};

export { interactionCreateHandler, messageCreateHandler, readyHandler };
