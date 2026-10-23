const cheerio = require("cheerio");

module.exports = async (req, res) => {
  if (
    req.headers.authorization !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const url = process.env.FLASHSCORE_URL;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      signal: AbortSignal.timeout(15000)
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const matches = [];

    $("[class*='event__match']").each((_, element) => {
      const item = $(element);
      const text = item.text().replace(/\s+/g, " ").trim();

      if (text) {
        matches.push({
          id: item.attr("id") || null,
          text
        });
      }
    });

    return res.status(200).json({
      httpStatus: response.status,
      title: $("title").text(),
      matchesFound: matches.length,
      matches: matches.slice(0, 100),
      note: "Only match elements present in the returned HTML can be extracted."
    });
  } catch (error) {
    return res.status(502).json({
      error: error.message
    });
  }
};
