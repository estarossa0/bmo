import { readdirSync } from 'fs';

async function getCommands() {
  const promisesArray = [];

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
