const cheerio = require("cheerio");

module.exports = async (req, res) => {
  if (
    req.headers.authorization !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const url = process.env.FLASHSCORE_URL;

  if (!url) {
    return res.status(500).json({
      error: "Set FLASHSCORE_URL in Vercel"
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FootballMonitor/1.0)"
      },
      signal: AbortSignal.timeout(15000)
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    return res.status(200).json({
      status: response.status,
      title: $("title").text(),
      htmlLength: html.length,
      preview: $("body").text()
        .replace(/\s+/g, " ")
        .slice(0, 1000),
      note: "Page-fetch test only; live events are not yet parsed."
    });
  } catch (error) {
    return res.status(502).json({
      error: "Could not retrieve the page",
      message: error.message
    });
  }
};
