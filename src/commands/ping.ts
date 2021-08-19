import type { Command } from '../types';

const command: Command = {
  name: 'ping',
  description: 'Replies with server ping',
  async execute(interaction) {
    await interaction.reply(`${Date.now() - interaction.createdTimestamp} ms`);
  },
};

export default command;
