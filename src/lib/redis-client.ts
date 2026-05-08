import Redis from "ioredis";
const client = new Redis(
  "rediss://default:gQAAAAAAAQfqAAIgcDFmMWFjZmMxOGM5MjQ0YmNjODlmMDIxOTU0MDdhMzlmOQ@gentle-cat-67562.upstash.io:6379",
);
export default client;
