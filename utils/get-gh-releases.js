const MarkdownIt = require("markdown-it");

const gh = require("./github-client");
const stripEmoji = require("../lib").stripEmoji;

const md = new MarkdownIt();

module.exports = async function getReleases(owner, repo, count = 10) {
  const releases = await gh.getReleases(owner, repo, count);

  return releases.map(release => {
    return {
      name: stripEmoji(release.name),
      tag_name: release.tag_name,
      url: release.html_url,
      author: release.author.login,
      created_at: new Date(release.created_at),
      published_at: new Date(release.published_at),
      releasenotes: md.render(stripEmoji(release.body))
    };
  });
};
