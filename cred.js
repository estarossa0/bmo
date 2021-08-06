import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';

let token = null;

async function getNewToken() {
  const cred = new URLSearchParams();
  const config = JSON.parse(await readFile('./config.json'));
  cred.append('grant_type', 'client_credentials');
  cred.append('client_id', config.intra.uid);
  cred.append('client_secret', config.intra.secret);
  try {
    const data = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: cred,
    });
    return data.json().then((response) => (response = response.access_token));
  } catch (err) {
    return err;
  }
}

function getToken() {
  const config = JSON.parse(readFileSync('./config.json'));
  return config.intra.token;
}
export { getNewToken, getToken };
