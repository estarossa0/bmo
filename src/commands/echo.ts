import type { Command } from '../types';

const command: Command = {
  name: 'echo',
  description: 'Replies with your INPUT argument',
  options: [
    {
      type: 'STRING',
      name: 'input',
      required: true,
      description: 'your message',
    },
  ],
  async execute(interaction) {
    await interaction.reply({
      content: `${
        interaction.options.data.find((arg) => arg.name === 'input')?.value
      }`,
      ephemeral: process.env.EPHEMERAL === 'true',
    });
  },
};

export default command;
