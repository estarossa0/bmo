import got from "got";
import { Client, MessageEmbed } from "discord.js";
import prisma from "../prisma/client";

const lastExamId: { kh: number | undefined; bg: number | undefined } = {
  kh: undefined,
  bg: undefined,
};
let interval: NodeJS.Timer | null = null;

async function notifySubs(client: Client, exam: any, campus: string) {
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

  const subs = await prisma.examSubscriber.findMany({
    where: { campus: campus },
  });
  subs.forEach((subscriber) => {
    client.users
      .fetch(subscriber.discord_id)
      .then((user) => user.send({ embeds: [embed] }));
  });
}

async function fetchCampusExam(client: Client, campus: string) {
  const campusName = campus === "16" ? "kh" : "bg";

  got<Array<any>>(
    `https://api.intra.42.fr/v2/campus/${campus}/cursus/21/exams`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INTRA_TOKEN}`,
      },
      resolveBodyOnly: true,
      responseType: "json",
    },
  )
    .then((response) => {
      if (lastExamId[campusName] === undefined)
        lastExamId[campusName] = response[0].id;
      if (response[0].id != lastExamId[campusName]) {
        lastExamId[campusName] = response[0].id;
        notifySubs(client, response[0], campus);
      }
    })
    .catch((err) => console.log(err));
}

async function checkExam(client: Client) {
  const time = new Date().getHours();

  if (time > 18 || time < 10) return;
  fetchCampusExam(client, "16");
  fetchCampusExam(client, "21");
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
