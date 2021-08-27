import { MessageActionRow, MessageSelectMenu } from "discord.js";
import got from "got";
import prisma from "../../prisma/client";
import type { Command } from "../../types";

const getList = async (): Promise<MessageActionRow> => {
  const list = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("logtime")
      .setPlaceholder("Select month")
      .addOptions([
        {
          label: "January",
          value: "0",
        },
        {
          label: "February",
          value: "1",
        },
        {
          label: "March",
          value: "2",
        },
        {
          label: "April",
          value: "3",
        },
        {
          label: "May",
          value: "4",
        },
        {
          label: "June",
          value: "5",
        },
        {
          label: "July",
          value: "6",
        },
        {
          label: "August",
          value: "7",
        },
        {
          label: "September",
          value: "8",
        },
        {
          label: "October",
          value: "9",
        },
        {
          label: "November",
          value: "10",
        },
        {
          label: "December",
          value: "11",
        },
      ]),
  );

  return list;
};

const getLocationPage = async (
  page: number,
  begin: string,
  end: string,
  intraId: number,
): Promise<Array<any>> => {
  const response = await got<Array<any>>(
    `https://api.intra.42.fr/v2/users/${intraId}/locations/?page=${page}&per_page=100&range[begin_at]=${begin},${end}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INTRA_TOKEN}`,
      },
      throwHttpErrors: false,
      resolveBodyOnly: true,
      responseType: "json",
    },
  );
  return response;
};

const getLogTime = async (month: number, userId: number): Promise<string> => {
  let response: Array<any>;
  let totalTime = 0;
  let page = 1;

  const date = new Date();

  if (month) date.setMonth(month);

  date.setUTCHours(0, 0, 0, 0);
  date.setDate(1);
  const beginDate = date.toISOString();

  const nextMonth = date.getMonth() !== 12 ? date.getMonth() + 1 : 1;
  date.setMonth(nextMonth);

  const endDate = date.toISOString();

  do {
    response = await getLocationPage(page, beginDate, endDate, userId);
    response.forEach((login: any) => {
      if (login.primary === false) return;
      const begin = Date.parse(login.begin_at);
      const end = login.end_at ? Date.parse(login.end_at) : Date.now();
      totalTime += end - begin;
    });
    page++;
  } while (response.length === 100);
  totalTime /= 1000 * 60 * 60;
  const hours = Math.trunc(totalTime);
  const minutes = Math.round((totalTime % 1) * 60);

  return `${hours}h${minutes}m`;
};

const command: Command = {
  name: "logtime",
  description: "Tell your login time",
  options: [
    {
      type: "STRING",
      name: "select",
      required: false,
      description: "Choose wich month or just use current month",
      choices: [
        { name: "Select month", value: "true" },
        { name: "current month", value: "false" },
      ],
    },
  ],
  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: process.env.EPHEMERAL === "true",
    });

    const intraId = await prisma.usersToken
      .findUnique({
        where: { discord_id: interaction.user.id },
      })
      .then((user) => user?.intra_id || null);

    if (intraId === null) {
      interaction.editReply(
        "you need to authorize with /init command to use /logtime",
      );
      return;
    }

    const month = interaction.options.getString("select", false);
    if (month === "true") {
      const row = await getList();
      interaction.editReply({
        content: "Select which month",
        components: [row],
      });
    } else {
      const logTime = await getLogTime(0, intraId);

      interaction.editReply(logTime);
    }
  },
};

export { command as default, getLogTime };
