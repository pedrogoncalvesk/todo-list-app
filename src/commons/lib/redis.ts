import { Redis } from '@upstash/redis';

import env from '../environment';

export const databaseName =
  process.env.NODE_ENV === "development"
    ? "todo-list-app-dev"
    : "todo-list-app";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
