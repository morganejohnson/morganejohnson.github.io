/* =====================================================================
   NEBRASKA OUTLIER — GAME SETTINGS
   ---------------------------------------------------------------------
   Safe to edit. Change names, colors, point values, result titles and
   the share link here without touching the game code.
   ===================================================================== */

window.NO_CONFIG = {
  questionsPerGame: 7,
  secondsPerQuestion: 20,

  // Daily Challenge "edition #1" date. Edition numbers count up from here.
  dailyEpoch: "2026-11-11",

  // Everyone's "day" flips at midnight in this time zone, so the Daily
  // Challenge is the same on every device no matter where the player is.
  dailyTimeZone: "America/Chicago",

  // Link included in shared results. Leave "" to use the page's own URL
  // (when it is hosted on the web).
  shareUrl: "",

  // Shown in the footer and on the share image.
  publication: "The Daily Nebraskan",
};

/* ---------------------------------------------------------------------
   RARITY TIERS
   key       – used in questions.js (common, familiar, unusual, rare, extreme)
   label     – the official rarity level
   name      – the Nebraska-themed nickname shown to players
   blurb     – one-line explanation shown on the home screen
   emoji     – used in the shareable text grid
   --------------------------------------------------------------------- */
window.NO_TIERS = {
  common: {
    label: "Common", name: "Cornstalk", points: 10, emoji: "🌽",
    blurb: "One of millions. Everybody thought of it.",
  },
  familiar: {
    label: "Familiar", name: "Grain Elevator", points: 25, emoji: "🌾",
    blurb: "Every town has one. Solid, but you'll see it again.",
  },
  unusual: {
    label: "Unusual", name: "Sandhill Crane", points: 50, emoji: "🐦",
    blurb: "You have to be in the right place at the right time.",
  },
  rare: {
    label: "Rare", name: "Chimney Rock", points: 75, emoji: "🪨",
    blurb: "A landmark answer. People notice when you find it.",
  },
  extreme: {
    label: "Extremely Rare", name: "Carhenge", points: 100, emoji: "🚗",
    blurb: "Strange, specific, one of a kind. Pure Outlier.",
  },
};

// What players see when an answer isn't in the database.
window.NO_MISS = { label: "No match", name: "Tumbleweed", points: 0, emoji: "⬜" };

/* ---------------------------------------------------------------------
   CATEGORIES (ids are used in questions.js)
   --------------------------------------------------------------------- */
window.NO_CATEGORIES = {
  husker:   { name: "Husker Nation",           short: "Huskers" },
  only:     { name: "Only in Nebraska",        short: "Only in NE" },
  midwest:  { name: "Midwest Made",            short: "Midwest" },
  campus:   { name: "Campus Culture",          short: "Campus" },
  roadtrip: { name: "Nebraska Road Trip",      short: "Road Trip" },
  weather:  { name: "Nebraska Weather Report", short: "Weather" },
};

/* ---------------------------------------------------------------------
   RESULT TITLES (checked top to bottom; first match wins)
   --------------------------------------------------------------------- */
window.NO_RESULTS = [
  { min: 600, title: "Nebraska Legend",
    line: "They should put your face on the Capitol next to the Sower." },
  { min: 450, title: "Certified Cornhusker",
    line: "You think like a Sandhills rancher and talk like a Haymarket regular." },
  { min: 300, title: "Midwest Master",
    line: "Solid answers, a few deep cuts. Your grandma would be proud." },
  { min: 150, title: "Nebraska Newcomer",
    line: "You know the interstate. Time to take the exit ramps." },
  { min: 0, title: "Time for a Nebraska Road Trip",
    line: "Gas up, grab a Runza and go see what's past Kearney." },
];
