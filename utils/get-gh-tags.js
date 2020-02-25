const gh = require("./github-client");
const getCommit = require("./get-gh-commit");

module.exports = async function getTags(owner, repo, count = 5) {
  const tags = await gh.getTags(owner, repo, count);

  for (const tag of tags) {
    // Inject the actual commit data into the `tag.commit` object (not just the SHA).
    tag.commit = await getCommit(owner, repo, tag.commit.sha);
  }
  return tags;
};
