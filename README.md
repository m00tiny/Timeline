# Interactive Timeline

An interactive, customizable timeline for presenting career milestones, project
history, or engineering achievements. The site is built with plain HTML, CSS,
and JavaScript, so it can be hosted directly on GitHub Pages without a build
step.

## Features

- Vertical and horizontal timeline layouts
- Light and dark themes
- Configurable accent color and card density
- Optional category badges
- Live personalization drawer
- Editable timeline events
- Browser local storage for saved preferences
- Downloadable `config.js` export for publishing changes
- Responsive controls and keyboard-friendly navigation

## Project Structure

```text
index.html  Page structure and personalization drawer
styles.css  Themes, layout styles, and responsive design
app.js      Rendering, interactions, persistence, and config export
config.js   Default metadata and timeline events
```

## Run Locally

Serve the project directory with any static HTTP server. For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

You can also open `index.html` directly, but serving it locally provides a
closer match to GitHub Pages behavior.

## Customize

Open the **Customize** button on the timeline to change its title, eyebrow,
subtitle, author, accent color, density, theme settings, and milestones.

Changes are saved in the browser's local storage. Use **Download Updated
config.js** to export the current configuration. Replace the existing
`config.js` file with the downloaded version to make those changes the default
for all visitors.

### Configuration

The default content and appearance live in `window.DEFAULT_TIMELINE_CONFIG`
inside `config.js`.

```javascript
window.DEFAULT_TIMELINE_CONFIG = {
  author: "Stuart Cannon Gray",
  eyebrow: "CHRONOLOGY & MILESTONES",
  title: "Systems, Security & Engineering Timeline",
  subtitle: "Key architectural deployments and research initiatives.",
  defaultTheme: "light",
  defaultLayout: "vertical",
  accentColor: "#2563eb",
  density: "comfortable",
  showTags: true,
  events: [
    {
      date: "2026",
      tag: "Milestone",
      title: "Example Milestone",
      description: "Describe the impact or outcome.",
      linkText: "",
      linkUrl: ""
    }
  ]
};
```

## Deployment

This project has no build dependencies and can be deployed as a static site.
When hosted from a GitHub repository, enable GitHub Pages in the repository
settings and configure it to publish from the repository's default branch.
