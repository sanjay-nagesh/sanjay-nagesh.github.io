# Sanjay Nagesh — Embedded Systems Portfolio

A single-page static portfolio site.

Files:

- `index.html` — the whole site (Home / About / Projects / Experience sections, navigated via in-page anchors)
- `css/styles.css` — stylesheet
- `js/site.js` — loads project cards from `data/projects.json` and renders the details modal
- `js/menu.js` — mobile nav toggle
- `data/projects.json` — project content shown on the Projects section
- `assets/` — images used across the site

To preview locally (project cards are fetched via `/data/projects.json`, so the page must be served, not opened directly as a file):

```powershell
# from the site folder
python -m http.server 8000
# then open http://localhost:8000
```
