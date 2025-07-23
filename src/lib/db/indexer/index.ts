import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../../../env";
import * as schema from "./schema";

export const indexer = drizzle(env.DATABASE_URL_INDEXER, {
  schema,
});
