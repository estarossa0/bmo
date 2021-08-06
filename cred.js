import fetch from 'node-fetch';

async function getNewToken() {
  const cred = new URLSearchParams();
  cred.append('grant_type', 'client_credentials');
  cred.append('client_id', process.env.INTRA_UID);
  cred.append('client_secret', process.env.INTRA_SECRET);
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

export { getNewToken };
