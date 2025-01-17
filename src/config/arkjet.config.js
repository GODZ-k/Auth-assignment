import getEnv from "./envConfig.js";
import arcjet,{ shield, detectBot, tokenBucket } from "@arcjet/node";

const aj = arcjet({
    key: getEnv.ARKJET_SECRET_KEY,
    characteristics: ["ip.src"], 
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE", 
        ],
      }),
      tokenBucket({
        mode: "LIVE",
        refillRate: 10, 
        interval: 10, 
        capacity: 10, 
      }),
    ],
  });

export default aj