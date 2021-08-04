const command = {
  name: 'ping',
  description: 'Replies with server ping',
  async execute(interaction) {
    await interaction.reply(`${interaction.createdTimestamp - new Date()} ms`);
  },
};

export default command;
