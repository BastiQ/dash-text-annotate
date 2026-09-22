# Contributing

Use small, focused changes with a runnable example or regression test. Synthetic text is enough to reproduce most issues; avoid putting private documents in bug reports or fixtures.

## Clean development setup

Use Node.js 24 LTS (`.nvmrc`) and Python 3.10+; Python 3.13 is used to regenerate checked-in bindings.

```sh
python -m venv .venv
# macOS/Linux; on Windows use .venv\Scripts\activate
. .venv/bin/activate
python -m pip install -e '.[dev]'
npm ci
npm run build
python usage.py
```

Activate the Python environment before `npm run build`: it invokes Dash's Python generator. `react-docgen` extracts metadata from the React component, then Dash generates the Python class. Do not edit `dash_text_annotate/DashTextAnnotate.py` by hand. Commit generated JS, CSS, Python, metadata, and third-party notices with source changes. End users need no Node installation.

`npm run build:js` bundles the frontend and extracts metadata; `npm run build` additionally regenerates the Python bindings. Dash provides React, ReactDOM, and PropTypes at runtime; never bundle another React instance. The build asserts this boundary.

## Checks

```sh
npm test
python -m pytest -m 'not browser'
# Requires Chrome; current Selenium can locate a compatible driver.
python -m pytest --run-browser -m browser
npm audit
python -m build
python -m twine check dist/*
python scripts/check_dist.py dist
```

Use `CHROME_BINARY` to choose an installed Chrome binary. Browser tests exercise a real Dash server and callbacks. The manual fixture can also be run with `PYTHONPATH=. python tests/browser_app.py` (port 8051).

Test overlapping spans, exact duplicate ranges with different labels, newlines, emoji, combining marks, deletion/undo, relabel metadata, invalid input, read-only mode, cross-boundary selections, external updates, and multiple instances. When modifying persistence, ensure two browser sessions never share mutable annotation state.

The npm lockfile fixes the frontend dependency tree. The Python runtime range is intentionally broader and is exercised across the CI matrix. Do not claim additional browser/Python/Dash support without checking it. Touch and screen-reader combinations need further validation.

## Architecture

- `src/lib/model.mjs`: validated span schema, offset conversion to/from Recogito, and pure bounded history.
- `src/lib/components/DashTextAnnotate.react.js`: React lifecycle, Dash prop synchronization, editing/review UI, and engine lifecycle.
- `src/lib/styles.css`: scoped component styling and required Recogito renderer geometry.
- `dash_text_annotate/validation.py`: Python validation and legacy offset migration; keep behavior aligned with the JavaScript boundary.
- `usage.py`: app-level document/session storage and JSON workflows; never store per-user edits in global variables.
- `scripts/build.mjs`: reproducible bundle/metadata/licenses; `scripts/generate.py`: Dash bindings.

Dependency license texts omitted from upstream npm packages are retained in `licenses/`. When upgrading Recogito or Annotorious, verify those against the corresponding upstream source version. Generated `THIRD_PARTY_NOTICES.md` includes licenses for the modules actually bundled.

## Release checklist

1. Update `package.json` and `pyproject.toml` to the same version; regenerate `package-lock.json`, then run `npm run build`.
2. Update the changelog and remove the development-release notice from the README only when the release is actually available.
3. Run all checks above and require the GitHub Actions matrix to pass. Review the sdist/wheel contents with `scripts/check_dist.py`.
4. Install the wheel in a fresh environment outside the checkout and run `scripts/check_installed.py`. Verify the demo, import/export, and new/legacy offsets.
5. Commit the release changes, tag the version, and publish the reviewed distributions using the maintainer's PyPI account or a configured trusted publisher. This repository's CI only builds artifacts; it never publishes automatically.
6. Check installation from PyPI and add release notes with migration instructions. Do not claim a supported version based only on successful package installation.

See [product scope](PRODUCT.md), [design context](DESIGN.md), and [ecosystem rationale](docs/ecosystem.md) before adding unrelated workflow features.
