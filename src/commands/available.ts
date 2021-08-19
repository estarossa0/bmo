import { MessageEmbed } from 'discord.js';
import type { Command } from '../types';
import got from 'got';

const command: Command = {
  name: 'available',
  description: 'give info about USERNAME',
  options: [
    {
      type: 'STRING',
      name: 'username',
      required: true,
      description: 'the user you wanna check if available',
    },
  ],
  async execute(interaction) {
    const embedReply = new MessageEmbed();
    const userName = interaction.options.data.find(
      (arg) => arg.name === 'username'
    )?.value;

    const userData = await got('https://api.intra.42.fr/v2/users/arraji', {
      headers: {
        Authorization: `Bearer ${process.env.INTRA_TOKEN}`,
      },
      throwHttpErrors: false,
    }).then(async (response) => {
      if (response.statusCode != 200) {
        throw new Error(
          response.statusCode === 404
            ? 'username not found'
            : `intern server error ${response.statusCode}`
        );
      }
      return JSON.parse(response.body);
    });

    embedReply
      .setColor('#00babc')
      .setTitle(typeof userName === 'string' ? userName : 'Title')
      .setURL(`https://profile.intra.42.fr/users/${userName}`)
      .setThumbnail(userData.image_url)
      .addFields(
        {
          name: 'Status',
          value: userData.location === null ? 'Unavailable' : userData.location,
        },
        { name: '\u200B', value: '\u200B' },
        {
          name: 'Campus',
          value: userData.campus.find((campus: any) => campus.active === true)
            .name,
          inline: true,
        },
        {
          name: 'Level',
          value: userData.cursus_users
            .find((cursus: any) => cursus.end_at === null)
            .level.toString(),
          inline: true,
        },
        {
          name: 'Full name',
          value: userData.displayname,
          inline: false,
        }
      );

    await interaction.reply({
      embeds: [embedReply],
      ephemeral: process.env.EPHEMERAL === 'true',
    });
  },
};

export default command;
