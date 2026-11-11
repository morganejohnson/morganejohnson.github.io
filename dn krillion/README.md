# Nebraska Outlier

*Think you know Nebraska? Think again.*

This is a daily trivia game for The Daily Nebraskan. Each round gives players seven open-ended prompts and 20 seconds per prompt. Any correct answer scores points, and rarer correct answers score more.

The game is plain HTML, CSS and JavaScript. There's no build step and no server code. You can open `index.html` directly in a browser or host the folder anywhere static files are served, including GitHub Pages, the CMS or an iframe.

## Rarity scale

| Tier (shown to players) | Rarity level   | Points | Idea |
|-------------------------|----------------|-------:|------|
| 🌽 Cornstalk            | Common         | 10  | One of millions. Everybody thought of it. |
| 🌾 Grain Elevator       | Familiar       | 25  | Every town has one. |
| 🐦 Sandhill Crane       | Unusual        | 50  | You have to be in the right place at the right time. |
| 🪨 Chimney Rock         | Rare           | 75  | A landmark answer. |
| 🚗 Carhenge             | Extremely Rare | 100 | Strange, specific, one of a kind. |
| ⬜ Tumbleweed           | No match       | 0   | Not on the list. |

Rarity levels are editorial estimates, not measured statistics. The game says so on the home screen and in the footer.

## Files

```
index.html          The page: home, game and results screens
css/style.css       All styling. Colors are at the top in :root
js/config.js        Settings: timer, tier names/points, categories, result titles, share link
js/questions.js     THE QUESTION DATABASE (54 prompts, ~2,000 answers)
js/matcher.js       Checks typed answers against the database
js/game.js          Game logic: timer, daily/practice, scoring, results, sharing
tests/test.html     Open in a browser to check the database after editing
tests/checks.js     The checks used by test.html
tests/validate.js   Same checks from the command line: node tests/validate.js
```

## Editing questions

All prompts live in `js/questions.js`. Each one looks like this:

```js
{
  id: "only-towns",                 // unique, no spaces
  category: "only",                 // husker, only, midwest, campus, roadtrip, weather
  prompt: "Name a Nebraska town that isn't Lincoln or Omaha.",
  banned: ["Lincoln", "Omaha"],     // optional: answers the prompt rules out
  ignore: ["county"],               // optional: words dropped before matching
  answers: {
    common:   ["Kearney", "Grand Island|gi", "North Platte"],
    familiar: ["Scottsbluff", "Hastings", ...],
    unusual:  [...],
    rare:     [...],
    extreme:  ["Monowi", "Arthur", ...],
  },
},
```

- **Aliases:** put alternate spellings after a `|`. The first part is what players see, for example `"Lake McConaughy|lake mac|big mac"`.
- **Handled automatically:** capital letters, punctuation, apostrophes, extra spaces, "a/an/the" at the start, plurals, small typos (1 letter off for words of 5+ letters, 2 for 9+), and answers buried in a short phrase ("a really big couch" → Couch).
- **Listing several answers** at once ("couch and grill") only scores the *least* rare one, so players can't game it.
- **After editing,** open `tests/test.html` in a browser. It lists any problems, such as the same alias in two tiers, an empty tier or a broken banned word. It also has a box where you can type a test answer and see how it scores.
- Every question needs at least one answer in each of the five tiers.
- Accuracy matters. Every Nebraska town, county, landmark, person and fact in the starter bank is real. Please keep it that way, and look things up before adding them.

### Adding a new question

Copy an existing question block, give it a new `id`, change the prompt and answers, and save. Keep each category roughly balanced. The daily rotation cycles through each category, so a bigger category means its prompts repeat less often.

## How the Daily Challenge works

- **Same questions for everyone.** Today's 7 prompts are picked by a formula from the date (Central Time), so every phone and computer gets the same set without needing a server.
- **Every category, every day.** Each day includes all six categories plus one bonus prompt, rotating through categories. Within a category, prompts cycle through a shuffled order, so a prompt never repeats within 3 days and comes back about once every 8 days on average with the current 54 prompts. More prompts means fewer repeats.
- **One official score per day.** After finishing, the Daily button turns into "Today's score" and shows the results again. Closing the page mid-game saves progress. A question that was showing when the player left counts as 0, so reloading doesn't buy extra time.
- **Edition numbers** count from `dailyEpoch` in `config.js` (currently `2026-11-11` = No. 1). Change that to your launch date.
- **Heads-up:** adding or removing questions changes which prompts appear on *future* days. It doesn't affect anyone who has already started today, because their prompts are saved. To be safe, edit before midnight Central.

## What's saved, and privacy

Nothing leaves the player's device. The browser's `localStorage` holds:
- the optional nickname (used only on the share image)
- today's daily progress and results
- personal stats: best daily, daily streak, best practice score and games played

No accounts, emails or real names. Clearing browser data resets everything.

## Sharing

- **Share your score** opens the phone's share sheet. On desktop it copies text like this:
  ```
  Nebraska Outlier No. 1 · Nov 11, 2026
  🚗⬜🐦🪨🌽🚗🌾  335/700
  Midwest Master
  I scored 335 points on Nebraska Outlier! Think you know Nebraska better than me?
  https://…
  ```
  The share text never reveals the day's prompts or answers.
- **Save score image** makes a 1080×1350 PNG sized for Instagram and other social posts.
- Set `shareUrl` in `config.js` to the game's public link once it's published. Otherwise it uses the page's own address.

## Hosting / embedding

- **GitHub Pages:** it already works as part of this repo. Folder names with spaces make ugly links (`dn%20krillion`), so consider renaming the folder to something like `nebraska-outlier` before sharing the link.
- **On dailynebraskan.com:** upload the folder as-is, or embed it in an article or page:
  ```html
  <iframe src="https://YOUR-HOST/nebraska-outlier/" title="Nebraska Outlier"
          style="width:100%;height:1100px;border:0" loading="lazy"></iframe>
  ```
- Fonts load from Google Fonts. If they're blocked, the game falls back to system fonts and still works.

## What would need a backend: a shared leaderboard

Everything in this version runs in the browser, so it **cannot** show a leaderboard across players. There's no fake leaderboard. "Your scores" is clearly labeled as saved on this device. Players compare scores by sharing their results.

A real daily leaderboard needs a small database and an API. Options, roughly from easiest to hardest:

1. **Supabase or Firebase (free tier).** Create a project and a `scores` table (date, nickname, score, created_at) with an insert-only policy. Then add about 40 lines to `game.js` to submit a score in `finishGame()` and show the top 20 on the results screen. You'd need a project URL and a public key.
2. **The DN's own CMS or server**, if the web team can add a simple endpoint.

Before launching a leaderboard, plan for:
- **Cheating.** Scores come from the browser, so anyone technical can submit a fake 700. A serious leaderboard should re-score submitted answers on the server using the same `questions.js` + `matcher.js`.
- **Nickname moderation**, through a profanity filter or manual review.
- **Privacy.** Keep nicknames optional and never ask for emails.

## Credits & originality

Nebraska Outlier was inspired by the general idea of rarity-based trivia games. Its name, branding, rarity tiers, prompts, answer banks, scoring and design are original to this project.
