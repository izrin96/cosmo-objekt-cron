import "dotenv/config";
import { z } from "zod/v4";

const envSchema = z.object({
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  DATABASE_URL_INDEXER: z.string(),
});

export const env = envSchema.parse(process.env);
