# Irish-UK-US Swim Dive

Swimming and diving news and results from Ireland, the United Kingdom, and the United States. Auburn meet recaps are the first article series.

This is an unofficial fan and family site. It is independent of Auburn University and of any university or swimming federation.

The public site is [https://orthoblue.github.io/Irish-UK-US-Swim-Dive/](https://orthoblue.github.io/Irish-UK-US-Swim-Dive/).

## Add an article

Commit a Markdown file to `articles/` on `main`. No other change is required. The home page and the articles archive list it automatically.

Lists are ordered by the front-matter `date` (the meet’s final day), newest first. Articles from the same day are ordered by title.

**Path:** `articles/YYYY-MM-DD-meet-slug.md`

The date in the file name is the meet’s final day. Use lowercase words separated by hyphens.

**Format:**

```markdown
---
title: "Headline"
date: 2026-11-21
meet: "Meet name"
location: "City"
region: "Northern Ireland"
clubs:
  - Lisburn City Swimming Club
swimmers:
  - Dylan Registe
  - Eoghan McQuillan
summary: "One or two sentences for the home page."
---

# Headline

The story, then results tables, then a Sources list of URLs.
```

- `date` is an unquoted `YYYY-MM-DD`. It is the date used for ordering.
- `title`, `meet`, `location`, `summary`, `region`, `clubs`, and `swimmers` are optional.
- `region` is a short label such as `Northern Ireland`, `South West England`, `Ireland`, or `USA`.
- `clubs` and `swimmers` are YAML lists. Name the swimmers the story is about, not every row of a results table.
- An article with no `region` whose club is `Auburn University` is treated as `USA`.
- A missing title falls back to the file name, and a missing date falls back to the date in the file name.
- Keep the opening `#` headline. It repeats `title`, and the site shows that title once.
- Wide results tables scroll sideways on small screens.
- Quote any value that contains a colon.
- The file needs the `---` front matter block so it is treated as a page. Extra fields are fine.
- A file whose name starts with `_`, or one with `published: false` in the front matter, is left unpublished.

The Articles page can filter by region, club, swimmer, and meet, and can search the text. A filtered view is a normal link, for example `/articles/?region=Northern+Ireland&club=Lisburn+City+Swimming+Club`. Region and club tags on each card and article open that view.

### Tags for articles that are already published

Files in `articles/` are synced from writers’ folders. A repo copy that differs is overwritten, so do not add tags by editing those files in the repo.

Put tags for an existing file in [`_data/article_tags.yml`](_data/article_tags.yml). The key is the filename without `.md`. Those lists are merged with any `clubs` and `swimmers` in the article. A `region` in this file is used only when the article does not set one.

```yaml
"2026-11-21-wolfpack-elite-invitational":
  region: USA
  clubs:
    - Auburn University
  swimmers:
    - Zoey Zeller
```

Writers adding a new recap should put `region`, `clubs`, and `swimmers` in the article’s own front matter, as in the example above. The data file is the backfill for files that cannot be edited here.

## Pages

| Page | URL |
| --- | --- |
| Home | `/` |
| Articles | `/articles/` |
| Results | `/results/` |
| About | `/about/` |

The Results page embeds [https://orthoblue.github.io/swim-results/](https://orthoblue.github.io/swim-results/) and does not copy its data.

## Diving

Diving Weekly is a separate section. Its stories are not listed with the swimming articles.

**Path:** `diving/articles/YYYY-MM-DD-slug.md`

```markdown
---
title: "Headline"
date: 2026-11-27
location: "United Kingdom"
region: "UK"
summary: "One or two sentences."
---

# Headline

The weekly story.
```

`region` is shown as written. Current values are `US`, `UK`, and `Ireland`. `International` can be added later. There is no `meet` field. The page is ordered by `date`, newest first, then by title. A new file in `diving/articles/` is picked up on the next build with no other change.

The diving results dashboard is the five files in `diving/dashboard/` (`index.html`, `dv0.js`, `dv1.js`, `meets.js`, `summary.json`). They are copied as static files and served at `/diving/dashboard/`. A weekly sync can overwrite those five files in place. Do not rename them or add front matter; Jekyll would then stop copying them unchanged.

## GitHub Pages

Deploys are built by [`.github/workflows/pages.yml`](.github/workflows/pages.yml) on every push to `main`.

In the repository settings, **Pages → Build and deployment → Source** must be **GitHub Actions**.

The same files also build if Source is set to **Deploy from a branch**, branch `main`, folder `/ (root)`. Use that only if Actions is unavailable, and disable the workflow so its deploy job does not fail.

## Preview locally

```bash
gem install jekyll -v 3.10.0
jekyll serve --baseurl ""
```

Open [http://127.0.0.1:4000/](http://127.0.0.1:4000/). The live site uses the base path `/Irish-UK-US-Swim-Dive`. GitHub Pages builds with Jekyll 3.10.
