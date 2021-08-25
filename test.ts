import got from 'got';
import { ApplicationCommandData, Client, Collection } from 'discord.js';
import { config } from 'dotenv';
import { getNewToken } from './src/utils/cred';
import { PrismaClient } from '@prisma/client';
import { setInterval } from 'timers';
import { startInterval, stopInterval } from './src/utils/examInterval';
import app from './src/api/auth.route';
import { URL } from 'url';
import prisma from './src/prisma/client';
config({ path: './src/config/.env' });
async function main() {
  // /v2/users/:user_id/locations
  // 62377
  // process.env = (await getNewToken()).access_token;
  prisma.usersTokens
    .findUnique({ where: { discord_id: 'dd' } })
    .then((res) => {
      console.log(res);
      throw Error('kk');
    })
    .catch((err: Error) => console.log(err.name));
}
main();

// https://api.intra.42.fr/oauth/authorize?client_id=6c34aae9d7ca21f81d2d2569c33aeac599a18cd4a167824e9ec0d4bc53df2367&redirect_uri=http%3A%2F%2Flocalhost/auth&response_type=code
// 7200
