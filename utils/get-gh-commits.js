const linkifyIssues = require("linkify-issues");

const gh = require("./github-client");

module.exports = async function getCommits(owner, repo, count = 100) {
  const commits = await gh.getCommits(owner, repo, count);

  return (
    commits
      // Ignore any merge commits.
      .filter(commit => !commit.commit.message.startsWith("Merge "))
      .map(commit => {
        if (commit.commit.author.date) {
          commit.commit.author.date = new Date(commit.commit.author.date);
        }
        if (commit.commit.committer.date) {
          commit.commit.committer.date = new Date(commit.commit.committer.date);
        }

        commit.commit.message = linkifyIssues(commit.commit.message, {
          user: owner,
          repository: repo
        });

        delete commit.author;
        delete commit.committer;
        delete commit.node_id;
        delete commit.parents;
        delete commit.commit.tree;
        delete commit.commit.verification;
        return commit;
      })
  );
};
