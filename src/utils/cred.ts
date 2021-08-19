import fetch from 'node-fetch';

async function getNewToken() {
  const cred = new URLSearchParams();
  cred.append('grant_type', 'client_credentials');
  cred.append('client_id', process.env.INTRA_UID || 'noUID');
  cred.append('client_secret', process.env.INTRA_SECRET || 'nosecret');
  try {
    const data: Response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: cred,
    });
    return data.json().then((response) => (response = response.access_token));
  } catch (err) {
    return err;
  }
}

export { getNewToken };
