import axios, { AxiosInstance } from "axios";
import { config } from "dotenv";

config();

interface KcResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  session_state: string;
  scope: string;
}

const KEYCLOAK_SERVER_URL = process.env.KEYCLOAK_SERVER_URL as string;
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID as string;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM as string;
const KEYCLOAK_SECRET = process.env.KEYCLOAK_SECRET as string;

const details = {
  scope: "openid",
};

export let Axios: AxiosInstance;
export let token = "";
let refreshToken = "";
let defaultExpireTimeoutInSeconds = 300;

const useAuth = async (grantType: 'client_credentials' | 'refresh_token' = 'client_credentials') => {
  try {
    let body = `grant_type=${grantType}&scope=${details.scope}`;
    if (grantType === 'refresh_token') {
      body += `&refresh_token=${refreshToken}`;
    }
    
    const { data } = await axios.post<KcResponse>(
      `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            KEYCLOAK_CLIENT_ID + ":" + KEYCLOAK_SECRET
          ).toString("base64")}`,
        },
      }
    );
    console.log("useAuth", data);
    refreshToken = data.refresh_token;
    token = data.access_token;
    defaultExpireTimeoutInSeconds = data.expires_in;
  } catch (err) {
    console.log("useAuth error", err);
  }
};

export const initKeycloak = async () => {
  try {
    setInterval(async () => {
      await useAuth('refresh_token');
      Axios = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }, (defaultExpireTimeoutInSeconds - 5) * 1000); // little before expiration time
    await useAuth('client_credentials');
    Axios = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
