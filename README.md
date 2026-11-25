# Qt Creator Cheatsheet

An interactive light and dark Qt Creator cheat sheet for students, beginners, and developers who want to keep basic workflows, keyboard shortcuts, and solutions to common errors close at hand.

## Online and local usage

The project is a purely static website. It does not require Node.js, package installation, or a build step.

### Using it online

Open:

<https://qt-cheatsheet.them0rtys.xyz>

The root `.nojekyll` file is required for GitHub Pages to serve lesson `.md` files as-is; the site loads them directly in the browser.

### Running locally

In the repository root, start any static server. For example, with Python:

```bash
python3 -m http.server 4173
```

Then open:

<http://127.0.0.1:4173/>

Alternatively, use the Live Server extension in Visual Studio Code.

> [!NOTE]
> Open the page through an HTTP server, not using `file://`. Because `manifest.json` and Markdown files are loaded with `fetch()`, Chrome, Firefox, and Safari may not load the content when the file is opened directly.

## How to add new material

1. Create a new directory under `docs/`, for example `docs/05-testing/`.
2. Add a `README.md` file to it.
3. Add the file path to `docs/manifest.json`.
4. Create a pull request or push the changes to the branch from which GitHub Pages deploys the website.

An example of a new topic:

```text
docs/
└── 05-testing/
    └── README.md
```

Markdown files may begin with front matter:

```markdown
---
title: Testování Qt aplikace
tags: [qt, testing, qtest]
---

# Testování Qt aplikace

Lesson content...
```

The `title` field is used as the document title, and `tags` are displayed as labels below the heading.

## Registering material in the menu

All chapters are managed by [`docs/manifest.json`](docs/manifest.json):

```json
{
  "repo": {
    "url": "https://github.com/them0rtys/qt-creator-cheatsheet",
    "branch": "main"
  },
  "sections": [
    {
      "folder": "01-getting-started",
      "files": [
        {
          "path": "docs/01-getting-started/README.md",
          "title": "Getting Started"
        }
      ]
    }
  ]
}
```

Important rule: the `path` entry is relative to the repository root and must not start with `./`.

For example, a new section can be added as follows:

```json
{
  "folder": "05-testing",
  "files": [
    {
      "path": "docs/05-testing/README.md",
      "title": "Testing"
    }
  ]
}
```

The order of sections and files is taken exactly from the order specified in the manifest.

## Markdown and extras

Use standard GitHub-flavored Markdown. For better readability:

- Use one `#` heading as the main page heading
- Use `##` and `###` for content sections
- Specify a language for all code blocks
- Use tables for keyboard shortcuts
- Use relative links to other lessons

### Code blocks

The website supports syntax highlighting. Always add the recommended language after the opening three backticks:

````markdown
```cpp
#include <QDebug>

qDebug() << "Hello Qt";
```
````

The `cmake`, `bash`, `ini`, `json`, and `qml` languages are also available, along with other languages supported by `highlight.js`.

### Callout boxes

The Markdown parser supports custom GitHub-style callout syntax:

```markdown
> [!TIP]
> A useful tip.

> [!NOTE]
> Additional information.

> [!WARNING]
> A common error or risk.

> [!CAUTION]
> An action that may break something.
```

Supported types are `TIP`, `NOTE`, `WARNING`, and `CAUTION`.

### New lesson template

The project includes a ready-made template at [`templates/README_TEMPLATE.md`](templates/README_TEMPLATE.md). Copy it to a new directory and edit the front matter, headings, code, and exercises.

## Deployment to GitHub Pages

The repository can be deployed without a CI workflow because the JavaScript and CSS are purely client-side files.

1. On GitHub, open **Settings → Pages**.
2. In **Build and deployment**, set **Source: Deploy from a branch**.
3. Select the `main` branch and the `/ (root)` folder.
4. Save the settings and wait for the deployment to finish.

The default address will have the following form:

```text
https://them0rtys.github.io/qt-creator-cheatsheet/
```

The custom domain is specified in the [`CNAME`](CNAME) file.

## Custom domain

The `CNAME` file contains:

```text
qt-cheatsheet.them0rtys.xyz
```

The domain must have a DNS record for the `qt-cheatsheet` subdomain, configured according to the current GitHub Pages instructions. Then set the domain name in **Settings → Pages → Custom domain**.

After successful HTTPS validation, GitHub Pages offers the **Enforce HTTPS** option.

## Contributions

Contributions are welcome:

1. Create an issue for a suggestion, fix, or new material.
2. Fork the repository.
3. Create a branch, for example `docs/testing-section`.
4. Add a Markdown file and register it in `docs/manifest.json`.
5. Check the page locally using a static server.
6. Open a pull request.

When making changes, follow these guidelines:

- Use clear, concise, and practical language
- Dedicate one file to each topic
- Include instructions for Windows, Linux, and macOS when they differ
- Remember common errors and how to fix them
- Do not add personal data or secrets to the source files
- Test new internal links and external images

## License

The project is released under the [MIT](LICENSE) license.