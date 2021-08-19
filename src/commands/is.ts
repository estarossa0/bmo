import type { Command } from '../types';

const command: Command = {
  name: 'is',
  description: 'give the iscsi link',
  async execute(interaction) {
    interaction.reply({
      content: 'https://iscsi-tools.1337.ma',
      ephemeral: process.env.EPHEMERAL === 'true',
    });
  },
};

export default command;
