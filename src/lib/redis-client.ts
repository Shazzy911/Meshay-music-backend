import Redis from "ioredis";

const client = new Redis(
  "rediss://default:AaItAAIjcDEzZGUxOTcyMTExNDc0Y2U4ODU2ZDdmODg4NzQ5MDlkYXAxMA@central-cicada-41517.upstash.io:6379"
);

export default client;
