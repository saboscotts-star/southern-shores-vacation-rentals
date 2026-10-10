const PROPERTY_FEEDS = {
    "cape-escape": process.env.VRBO_ICAL_CAPE_ESCAPE,
    "half-shell": process.env.VRBO_ICAL_HALF_SHELL,
    "sandy-feet": process.env.VRBO_ICAL_SANDY_FEET,
    "tiger-town-escape": process.env.VRBO_ICAL_TIGER_TOWN_ESCAPE,
    "tiger-town-lakeside": process.env.VRBO_ICAL_TIGER_TOWN_LAKESIDE,
  };
  
  function parseICalDate(value) {
    if (!value) return null;
  
    const cleanValue = value.trim();
  
    // Handles standard all-day iCal dates such as 20261015
    const match = cleanValue.match(/^(\d{4})(\d{2})(\d{2})/);
  
    if (!match) return null;
  
    const [, year, month, day] = match;
  
    return `${year}-${month}-${day}`;
  }
  
  function unfoldICalLines(text) {
    // iCalendar permits long lines to continue on the next line
    // when that next line begins with a space or tab.
    return text.replace(/\r?\n[ \t]/g, "");
  }
  
  function parseBlockedDates(icalText) {
    const unfolded = unfoldICalLines(icalText);
  
    const events = unfolded
      .split("BEGIN:VEVENT")
      .slice(1)
      .map((event) => event.split("END:VEVENT")[0]);
  
    const blocked = [];
  
    for (const event of events) {
      const lines = event.split(/\r?\n/);
  
      const startLine = lines.find((line) =>
        line.toUpperCase().startsWith("DTSTART")
      );
  
      const endLine = lines.find((line) =>
        line.toUpperCase().startsWith("DTEND")
      );
  
      if (!startLine || !endLine) continue;
  
      const startValue = startLine.substring(startLine.indexOf(":") + 1);
      const endValue = endLine.substring(endLine.indexOf(":") + 1);
  
      const start = parseICalDate(startValue);
      const end = parseICalDate(endValue);
  
      if (!start || !end) continue;
  
      blocked.push({
        start,
        end,
      });
    }
  
    return blocked;
  }
  
  export default async function handler(req, res) {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
  
      return res.status(405).json({
        error: "Method not allowed",
      });
    }
  
    const property = req.query?.property;
  
    if (!property || !Object.prototype.hasOwnProperty.call(PROPERTY_FEEDS, property)) {
      return res.status(400).json({
        error: "Invalid property",
        validProperties: Object.keys(PROPERTY_FEEDS),
      });
    }
  
    const feedUrl = PROPERTY_FEEDS[property];
  
    if (!feedUrl) {
      return res.status(500).json({
        error: "Calendar feed is not configured for this property",
      });
    }
  
    try {
      const response = await fetch(feedUrl, {
        headers: {
          Accept: "text/calendar",
        },
      });
  
      if (!response.ok) {
        return res.status(502).json({
          error: "Unable to retrieve Vrbo calendar",
        });
      }
  
      const icalText = await response.text();
      const blocked = parseBlockedDates(icalText);
  
      // Allow short caching while avoiding exposure of the actual Vrbo feed URL.
      res.setHeader(
        "Cache-Control",
        "s-maxage=300, stale-while-revalidate=600"
      );
  
      return res.status(200).json({
        property,
        blocked,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Vrbo calendar error:", error);
  
      return res.status(500).json({
        error: "Unable to load availability",
      });
    }
  }