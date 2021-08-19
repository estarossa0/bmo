import type { Command } from '../types';

const command: Command = {
  name: 'ping',
  description: 'Replies with server ping',
  async execute(interaction) {
    await interaction.reply(
      `${interaction.createdTimestamp - new Date().getTime() / 1000} ms`
    );
  },
};

export default command;
