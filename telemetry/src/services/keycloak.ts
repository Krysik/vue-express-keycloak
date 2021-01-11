import session from "express-session";
import Keycloak, { KeycloakConfig } from "keycloak-connect";
import { config } from 'dotenv';

config();

interface IKeycloak extends KeycloakConfig {
	credentials: {
		secret: string;
	};
}

const keycloakConfig: IKeycloak = {
  "auth-server-url": process.env.KEYCLOAK_SERVER_URL as string,
  "confidential-port": 0,
  "ssl-required": 'external',
  credentials: {
    secret: process.env.KEYCLOAK_SECRET as string
  },
  realm: process.env.KEYCLOAK_REALM as string,
  resource: process.env.KEYCLOAK_CLIENT_ID as string
}

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

export { keycloak, memoryStore };
