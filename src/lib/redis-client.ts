import Redis from "ioredis";

// const client = new Redis(
//   "rediss://default:AaT6AAIjcDE1Y2FmOGYyZmQxNTY0OGJkODJhOTg5YjRhNzRmZjA4NHAxMA@whole-koala-42234.upstash.io:6379"
// );

const client = new Redis(
  "rediss://default:ASmVAAIncDJiYmY1YzIxZjNlOWI0NTM5YWM5ZmEwMjI1NDFjZjU5MXAyMTA2NDU@holy-wildcat-10645.upstash.io:6379"
);
export default client;
