import extend from '../utils/fetchExtend.js';
import { MessageEmbed } from 'discord.js';

const command = {
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
    ).value;

    const fetchIntra = extend({
      prefixUrl: 'https://api.intra.42.fr/v2/',
      options: {
        headers: {
          Authorization: `Bearer ${process.env.INTRA_TOKEN}`,
        },
      },
    });

    const userData = await fetchIntra(`users/${userName}`).then(
      async (response) => {
        if (!response.ok)
          throw new Error(
            response.status === 404
              ? 'username not found'
              : `intern server error ${response.status}`
          );
        return response.json();
      }
    );

    embedReply
      .setColor('#00babc')
      .setTitle(userName)
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
          value: userData.campus.find((campus) => campus.active === true).name,
          inline: true,
        },
        {
          name: 'Level',
          value: userData.cursus_users
            .find((cursus) => cursus.end_at === null)
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
