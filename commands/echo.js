const command = {
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
    await interaction.reply(
      `${interaction.options.data.find((arg) => arg.name === 'input').value}`
    );
  },
};

export default command;
