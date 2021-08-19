import { ApplicationCommandData, Client, Collection } from 'discord.js';
import getCommands from './utils/commandsHandler';
import { config } from 'dotenv';
import { getNewToken } from './utils/cred';
import type { Command } from './types';

async function main() {
  config();

  process.env.INTRA_TOKEN = await getNewToken();
  const client: Client & { commands?: Collection<string, Command> } =
    new Client({
      intents: ['DIRECT_MESSAGES', 'GUILD_MESSAGES', 'GUILDS'],
    });

  let commandsArray: Command[] = await getCommands();

  client.once('ready', async () => {
    client.commands = new Collection();

    for (const command of commandsArray)
      client.commands.set(command.name, command);

    const commandsData: ApplicationCommandData[] = commandsArray.map(
      ({ execute, ...data }) => data
    );

    client.guilds.cache.forEach((guild) => guild.commands.set(commandsData)); // will be replaced with client.application.commands later

    console.log('ready');
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (!client.commands?.has(interaction.commandName)) return;

    try {
      await client.commands.get(interaction.commandName)?.execute(interaction);
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  });

  client.login(process.env.DISCORD_TOKEN).catch((err) => console.log(err));
}

main().catch((err) => console.log(err));
