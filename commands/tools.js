import { MessageEmbed } from 'discord.js';

const command = {
  name: 'tools',
  description: 'give script to install all tools',
  async execute(interaction) {
    const embedReply = new MessageEmbed();

    embedReply
      .setColor('GREEN')
      .addField(
        'this script can install these tools for you:',
        'brew, also valgrind, htop, docker, docker-machine, minikube using brew'
      )
      .addField('link:', 'https://github.com/ombhd/my_tools_installer')
      .setImage(
        'https://raw.githubusercontent.com/estarossa0/save/master/bot_tools.PNG'
      );

    interaction.reply({
      embeds: [embedReply],
      ephemeral: process.env.EPHEMERAL === 'true',
    });
  },
};

export default command;
