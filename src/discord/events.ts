import {
  ApplicationCommandData,
  Interaction,
  Message,
  Collection,
} from "discord.js";
import prisma from "../prisma/client";
import type { Command } from "../types";
import getCommands from "../utils/commandsHandler";
import client from "./client";
import { getLogTime } from "./commands/logtime";

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
  if (interaction.isSelectMenu() && interaction.customId === "logtime") {
    const month = parseInt(interaction.values[0]);

    const intraId = await prisma.usersToken
      .findUnique({
        where: { discord_id: interaction.user.id },
      })
      .then((user) => user?.intra_id || null);

    if (intraId === null) {
      interaction.reply(
        "you need to authorize with /init command to use /logtime",
      );
      return;
    }

    const logTime = await getLogTime(month, intraId);

    interaction.update({ content: logTime, components: [] });
  }

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
