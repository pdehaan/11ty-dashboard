const { Octokit } = require("@octokit/rest");

const pkg = require("../package.json");

const gh = new Octokit({
  userAgent: `${pkg.name} v${pkg.version}`,
  timeZone: "America/Vancouver",
  baseUrl: "https://api.github.com",
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  }
});

function ratelimitLogger(res) {
  const rlHeader = name => Number(res.headers[`x-ratelimit-${name}`]);
  const remaining = rlHeader("remaining");
  const limit = rlHeader("limit");
  const reset = new Date(rlHeader("reset") * 1000).toLocaleTimeString();
  console.info(
    `[${res.status}] ${res.url} (ratelimit: ${remaining}/${limit} -- resets: ${reset})`
  );
  return res;
}

module.exports = {
  // $gh: gh,
  getCommit,
  getCommits,
  getReleases,
  getTags
};

async function getCommit(owner, repo, commit_sha = "") {
  const res = await gh.git.getCommit({
    owner,
    repo,
    commit_sha
  });
  ratelimitLogger(res);
  return res.data;
}

async function getCommits(owner, repo, count = 100) {
  const res = await gh.repos.listCommits({
    owner,
    repo,
    per_page: count
  });
  ratelimitLogger(res);
  return res.data;
}

async function getReleases(owner, repo, count = 10) {
  const res = await gh.repos.listReleases({
    owner,
    repo,
    per_page: count
  });
  ratelimitLogger(res);
  return res.data;
}

async function getTags(owner, repo, count = 5) {
  const res = await gh.repos.listTags({
    owner,
    repo,
    per_page: count
  });

  ratelimitLogger(res);
  return res.data;
}
