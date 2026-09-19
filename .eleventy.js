module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/static/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/static/ads.txt": "ads.txt" });
  eleventyConfig.addPassthroughCopy({ "src/static/CNAME": "CNAME" });

  eleventyConfig.addCollection("tools", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/ferramentas/*.njk")
      .sort((a, b) => a.data.title.localeCompare(b.data.title, "pt-BR"));
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
