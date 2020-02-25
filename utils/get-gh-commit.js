const gh = require("./github-client");

module.exports = async function getCommit(owner, repo, commit_sha) {
  const commit = await gh.getCommit(owner, repo, commit_sha);

  delete commit.node_id;
  delete commit.parents;
  delete commit.tree;
  delete commit.verification;
  return commit;
};
