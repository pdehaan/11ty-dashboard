const emojiStrip = require("emoji-strip");

module.exports = eleventyConfig => {
  const DateTime = eleventyConfig.DateTime;
  eleventyConfig.addFilter("emoji_strip", string => emojiStrip(string));
  eleventyConfig.addShortcode("time", date => {
    date = DateTime.fromJSDate(new Date(date));
    const datetime = date.toISODate();
    const label = date.toFormat("yyyy LLL dd");
    return `<time datetime="${datetime}">${label}</time>`;
  });

  return {
    dir: {
      input: "src",
      output: "www"
    }
  };
};
