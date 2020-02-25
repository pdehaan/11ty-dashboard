const fs = require("fs").promises;
const path = require("path");

const {DateTime} = require("luxon");

const lib = require("../lib");
const utils = require("../utils/index");

main("11ty", "eleventy", {endDate: "2020-02-09"});

async function main(owner, repo, range={}) {
  const dateRange = lib.createDateRange(range);
  const inDateRange = lib.inDateRange(dateRange.startDate, dateRange.endDate);

  const news = await utils.getNews();
  const releases = await utils.getReleases(owner, repo);
  const tags = await utils.getTags(owner, repo);
  const commits = await utils.getCommits(owner, repo);
  const websiteCommits = await utils.getCommits(owner, "11ty-website");

  const data = {
    github: {
      owner,
      repo
    },

    startDate: dateRange.startDate,
    endDate: dateRange.endDate,

    // NOTE: `latestNews` might be outside of date range.
    // TODO: This pulls the most recent items, so things get funny if you're trying to create old posts
    // since the archive for 2020-02-16 might have latest news from 2020-03-10. Not sure how much additional
    // logic and filtering we want to ensure the `latestNews` is before the endDate, but possibly also before
    // the `startDate`. :shrug:
    latestNews: news.items.filter(item => new Date(item.pubDate) <= dateRange.endDate)[0],
    recentNews: news.items.filter(item => inDateRange(item.pubDate)),

    // NOTE: `latestRelease` might be outside of date range.
    latestRelease: releases[0],
    recentReleases: releases.filter(release =>
      inDateRange(release.created_at || release.published_at)
    ),

    // NOTE: `latestTag` might be outside of date range.
    latestTag: tags.filter(tag => new Date(tag.commit.committer.date) <= dateRange.endDate)[0],
    recentTags: tags.filter(tag => inDateRange(new Date(tag.commit.committer.date))),

    recentCommits: commits.filter(commit =>
      inDateRange(commit.commit.committer.date)
    ),

    websiteCommits: websiteCommits.filter(commit => inDateRange(commit.commit.committer.date))
  };

  const endDate = DateTime.fromJSDate(dateRange.endDate).toISODate();

  const BASE_NAME = path.join("./src/posts", `${endDate}-this-week-in-eleventy`);

  // Something like "{yyyy}-{mm}-{dd}-this-week-in-eleventy.11tydata.json" (with relative path).
  const dataFilename = `${BASE_NAME}.11tydata.json`;
  console.log(`Writing "${dataFilename}"`);
  await fs.writeFile(dataFilename, JSON.stringify(data, null, 2));

  // Something like "{yyyy}-{mm}-{dd}-this-week-in-eleventy.liquid" (with relative path).
  const templateFilename = `${BASE_NAME}.liquid`;
  try {
    await fs.stat(templateFilename);
    console.log(`"${templateFilename}" exists. Skipping`);
  } catch (err) {
    console.log(`Writing "${templateFilename}"`);
    await fs.writeFile(templateFilename, `---\ntitle: This Week in Eleventy (${endDate})\nlayout: layouts/this-week-in-eleventy.liquid\n---\n\n`);
  }
}
