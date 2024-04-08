const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const { mode } = program.opts();

dotenv.config({
  path: mode === "production" ? "./.env.production" : "./.env.development",
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
};

module.exports = configObject;
