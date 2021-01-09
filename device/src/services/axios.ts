import axios, { AxiosInstance } from "axios";
import { config } from "dotenv";

config();

const KEYCLOAK_SERVER_URL = process.env.KEYCLOAK_SERVER_URL;
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
const KEYCLOAK_SECRET = process.env.KEYCLOAK_SECRET;

const details = {
  grantType: "client_credentials",
  scope: "openid",
};

export let Axios: AxiosInstance;
export let token = "";
let defaultExpireTimeoutInSeconds = 300;

const useAuth = async () => {
  try {
    const { data } = await axios.post(
      `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      `grant_type=${details.grantType}&scope=${details.scope}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            KEYCLOAK_CLIENT_ID + ":" + KEYCLOAK_SECRET
          ).toString("base64")}`,
        },
      }
    );
    console.log("useAuth");

    token = data.access_token;
    defaultExpireTimeoutInSeconds = data.expires_in;

    return data;
  } catch (err) {
    console.log("useAuth error", err);
  }
};

export const initKeycloak = async () => {
  try {
    setInterval(async () => {
      await useAuth();
    }, defaultExpireTimeoutInSeconds * 1000);
    await useAuth();
    Axios = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
