# Irish-UK-US Swim Dive

Swimming and diving news and results from Ireland, the United Kingdom, and the United States. Auburn meet recaps are the first article series.

This is an unofficial fan and family site. It is independent of Auburn University and of any university or swimming federation.

The public site is [https://orthoblue.github.io/Irish-UK-US-Swim-Dive/](https://orthoblue.github.io/Irish-UK-US-Swim-Dive/).

## Add an article

Commit a Markdown file to `articles/` on `main`. No other change is required. The home page and the articles archive list it automatically, newest first.

**Path:** `articles/YYYY-MM-DD-meet-slug.md`

The date in the file name is the meet’s final day. Use lowercase words separated by hyphens.

**Format:**

```markdown
---
title: "Headline"
date: 2026-11-21
meet: "Meet name"
location: "City"
summary: "One or two sentences for the home page."
---

# Headline

The story, then results tables, then a Sources list of URLs.
```

- `date` is an unquoted `YYYY-MM-DD`.
- `title`, `meet`, `location`, and `summary` are optional. A missing title falls back to the file name, and a missing date falls back to the date in the file name.
- Keep the opening `#` headline. It repeats `title`, and the site shows that title once.
- Wide results tables scroll sideways on small screens.
- Quote any value that contains a colon.
- The file needs the `---` front matter block so it is treated as a page. Extra fields are fine.
- A file whose name starts with `_`, or one with `published: false` in the front matter, is left unpublished.

## Pages

| Page | URL |
| --- | --- |
| Home | `/` |
| Articles | `/articles/` |
| Results | `/results/` |
| About | `/about/` |

The Results page embeds [https://orthoblue.github.io/swim-results/](https://orthoblue.github.io/swim-results/) and does not copy its data.

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
