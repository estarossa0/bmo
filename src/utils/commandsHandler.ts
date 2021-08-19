import { readdirSync } from 'fs';
import { Command } from '../types';

async function getCommands(): Promise<Command[]> {
  const promisesArray: Promise<Command>[] = [];

  const commandFiles = readdirSync('./commands').filter((file) =>
    file.endsWith('.js')
  );

  for (const file of commandFiles) {
    promisesArray.push(
      import(`./commands/${file}`).then(
        (command) => (command = command.default)
      )
    );
  }
  return Promise.all(promisesArray);
}

export default getCommands;
