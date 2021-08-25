import got from "got";
import { Client, MessageEmbed } from "discord.js";
import prisma from "../prisma/client";

let lastExamId: number | undefined = undefined;
let interval: NodeJS.Timer | null = null;

async function notifySubs(client: Client, exam: any) {
  const embed = new MessageEmbed();

  const weekdays = new Array(7);
  weekdays[0] = "Sunday";
  weekdays[1] = "Monday";
  weekdays[2] = "Tuesday";
  weekdays[3] = "Wednesday";
  weekdays[4] = "Thursday";
  weekdays[5] = "Friday";
  weekdays[6] = "Saturday";

  const date = new Date(exam.begin_at);
  lastExamId = exam.id;

  embed
    .setTitle("New exam")
    .setColor("#FF6950")
    .setDescription(exam.name)
    .addFields(
      {
        name: "date",
        value: weekdays[date.getDay()] + ", " + date.toLocaleDateString(),
      },
      {
        name: "Total places",
        value: exam.max_people?.toString() || "unknown",
      },
      {
        name: "location",
        value: exam.location,
      },
    );

  const subs = await prisma.examSubscriber.findMany();
  subs.forEach((subscriber) => {
    client.users
      .fetch(subscriber.discord_id)
      .then((user) => user.send({ embeds: [embed] }));
  });
}

async function checkExam(client: Client) {
  const time = new Date().getHours();

  if (time > 18 || time < 10) return;
  got<Array<any>>("https://api.intra.42.fr/v2/campus/16/cursus/21/exams", {
    headers: {
      Authorization: `Bearer ${process.env.INTRA_TOKEN}`,
    },
    throwHttpErrors: false,
    resolveBodyOnly: true,
    responseType: "json",
  })
    .then((response) => {
      if (response[0].id != lastExamId) {
        notifySubs(client, response[0]);
      }
    })
    .catch((err) => console.log(err));
}

async function startInterval(client: Client, hours: number): Promise<void> {
  if (!interval)
    interval = setInterval(checkExam, hours * 60 * 60 * 1000, client);
}

async function stopInterval(): Promise<void> {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

export { startInterval, stopInterval };
