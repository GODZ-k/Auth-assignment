import getEnv from "./envConfig.js";
import arcjet,{ shield, detectBot, tokenBucket } from "@arcjet/node";

const aj = arcjet({
    // Get your site key from https://app.arcjet.com and set it as an environment
    // variable rather than hard coding.
    key: getEnv.ARKJET_SECRET_KEY,
    characteristics: ["ip.src"], // Track requests by IP
    rules: [
      // Shield protects your app from common attacks e.g. SQL injection
      shield({ mode: "LIVE" }),
      // Create a bot detection rule
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        ],
      }),
      tokenBucket({
        mode: "LIVE",
        refillRate: 10, // Refill 5 tokens per interval
        interval: 10, // Refill every 10 seconds
        capacity: 10, // Bucket capacity of 10 tokens
      }),
    ],
  });

export default aj