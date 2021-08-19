import got from 'got';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
}

async function getNewToken(): Promise<string> {
  const cred = new URLSearchParams();
  cred.append('grant_type', 'client_credentials');
  cred.append('client_id', process.env.INTRA_UID || 'noUID');
  cred.append('client_secret', process.env.INTRA_SECRET || 'nosecret');
  try {
    const data = await got
      .post('https://api.intra.42.fr/oauth/token', {
        searchParams: {
          grant_type: 'client_credentials',
          client_id: process.env.INTRA_UID || 'noUID',
          client_secret: process.env.INTRA_SECRET || 'nosecret',
        },
      })
      .json<TokenResponse>()
      .then<string>((response) => response.access_token);
    return data;
  } catch (err) {
    return err;
  }
}

export { getNewToken };
