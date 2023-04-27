import { CustomProjectConfig } from "lost-pixel";

export const config: CustomProjectConfig = {
  pageShots: {
    pages: [
      {
        name: "home",
        path: "/",
      },
    ],
    baseUrl: "http://127.0.0.1:3000",
  },
  generateOnly: true,
  failOnDifference: true,
};
