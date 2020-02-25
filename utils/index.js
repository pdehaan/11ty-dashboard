module.exports = {
  // site XML feed.
  getNews: require("./get-news"),

  // GitHub API
  getCommits: require("./get-gh-commits"),
  getReleases: require("./get-gh-releases"),
  getTags: require("./get-gh-tags")
};
