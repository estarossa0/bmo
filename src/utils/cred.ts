import got from "got";
import { URLSearchParams } from "url";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
  refresh_token?: string;
}
async function updateToken(): Promise<void> {
  process.env.INTRA_TOKEN = (await getNewToken())?.access_token;
}
async function tokenInterval(): Promise<void> {
  await updateToken();
  setInterval(updateToken, 6600 * 1000);
}

async function getNewToken(code?: string): Promise<TokenResponse | null> {
  const cred = new URLSearchParams();
  cred.append("grant_type", "client_credentials");
  cred.append("client_id", process.env.INTRA_UID || "noUID");
  cred.append("client_secret", process.env.INTRA_SECRET || "nosecret");
  if (code) {
    cred.set("grant_type", "authorization_code");
    cred.append("code", code);
    if (process.env.INTRA_REDIRECT)
      cred.append("redirect_uri", process.env.INTRA_REDIRECT);
  }

  try {
    const data = await got
      .post("https://api.intra.42.fr/oauth/token", {
        searchParams: cred,
      })
      .json<TokenResponse>();
    return data;
  } catch (err) {
    return null;
  }
}

export { getNewToken, tokenInterval };
