const axios = require("axios");
const htmlparser2 = require("htmlparser2");

module.exports = parseFeed;

async function parseFeed() {
  const { data: feed } = await axios.get("https://11ty.dev/news/feed.xml");
  return htmlparser2.parseFeed(feed, { decodeEntities: true });
}
