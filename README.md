<p align="center">
  <img src="https://raw.githubusercontent.com/BastiQ/dash-text-annotate/main/docs/media/header.svg" alt="Dash Text Annotate — text annotation, inside Dash." width="960">
</p>

<p align="center">
  <a href="https://github.com/BastiQ/dash-text-annotate/blob/main/pyproject.toml"><img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat" alt="Python 3.10+"></a>
  <a href="https://github.com/BastiQ/dash-text-annotate/blob/main/pyproject.toml"><img src="https://img.shields.io/badge/Dash-3%20%7C%204-245B50?style=flat" alt="Dash 3 and 4"></a>
  <a href="https://github.com/BastiQ/dash-text-annotate/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-64776D?style=flat" alt="MIT license"></a>
</p>

<p align="center">
  <a href="#demo">Demo</a> · <a href="#quick-start">Quick start</a> · <a href="https://github.com/BastiQ/dash-text-annotate/blob/main/docs/reference.md">Component reference</a>
</p>

A small **text span annotation component for Dash**. Select a passage, assign a label, and receive structured annotations in Python callbacks. Source text stays intact, and everything runs inside your Dash app.

- Annotate with the mouse or keyboard.
- Use overlapping labels, passage badges, and undo/redo.
- Load and save annotations through ordinary Dash callbacks.

## Demo

https://github.com/user-attachments/assets/a99760d6-a1f2-4a46-8322-43855f6adeec

<details>
<summary>GIF version (if the video doesn't play)</summary>

<img width="960" height="840" alt="Live annotation demo: label a person and a date, undo, redo, and save." src="https://github.com/user-attachments/assets/f14fc433-6c0b-4327-8739-906d606f0694">

</details>

[Open video](https://github.com/user-attachments/assets/a99760d6-a1f2-4a46-8322-43855f6adeec) · [Run the example](#quick-start)

## Quick start

Requires **Python 3.10+** and **Dash 3 or 4**. JavaScript and CSS ship with the package; no Node.js or CDN is needed to use it.

Install the published package:

```sh
python -m pip install dash-text-annotate==0.1.0
```

If `0.1.0` is not yet listed on [PyPI](https://pypi.org/project/dash-text-annotate/), use the checkout installation below. The distribution name is `dash-text-annotate`; the Python import is `dash_text_annotate`.

> **0.1.0 is a breaking beta release.** Upgrading from the historical 0.0.1 prototype? Read the [migration guide](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/migration.md).

To install from a [repository checkout](https://github.com/BastiQ/dash-text-annotate) and run the full demo:

```sh
# From this repository checkout:
python -m pip install .
python usage.py
```

Open <http://127.0.0.1:8050>. The demo includes session saving, JSON import/export, and read-only review. Save before switching documents; your own app can use a database or files instead of browser-session storage.

## A small app

```python
import json
from dash import Dash, Input, Output, html
from dash_text_annotate import DashTextAnnotate

app = Dash(__name__)
app.layout = html.Main([
    DashTextAnnotate(
        id="annotator",
        text="😀 Acme opened an office in Berlin.",
        tag="ORG",
        tag_colors={"ORG": "#79b9a5"},
        show_labels=True,  # Set False for highlights without passage badges.
        label_position="right",  # Also supports "left", "top", and "bottom".
        entities=[],
    ),
    html.Pre(id="annotations"),
])

@app.callback(Output("annotations", "children"), Input("annotator", "entities"))
def show_annotations(entities):
    return json.dumps(entities or [], ensure_ascii=False, indent=2)

if __name__ == "__main__":
    app.run(debug=True)
```

Selecting `Acme` produces a record like this:

```json
{"id": "a-stable-uuid", "start": 2, "end": 6, "text": "Acme", "tag": "ORG", "color": "#79b9a5"}
```

`text[start:end]` in Python is exactly the selected passage. Offsets are **zero-based Unicode code points; end is exclusive**. Combining marks count separately. Use `offset_unit="utf16"` for legacy JavaScript offsets, or migrate them with `convert_offsets`.

## Documentation

- [Component reference](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/reference.md) — editing, keyboard controls, annotation data, and all properties.
- [Migration guide](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/migration.md) and [changelog](https://github.com/BastiQ/dash-text-annotate/blob/main/CHANGELOG.md) — upgrading from 0.0.1.
- [Contributing](https://github.com/BastiQ/dash-text-annotate/blob/main/CONTRIBUTING.md) — local development and tests.
- [Release guide](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/releasing.md) — building, publishing to PyPI, and listing in the Dash community.
- [Scope and alternatives](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/ecosystem.md) — where this component fits.

The component handles plain-text annotation. Document storage, authentication, and collaboration belong to your app. Modern desktop browsers are the target; see the [validation record](https://github.com/BastiQ/dash-text-annotate/blob/main/docs/validation.md) for checks and limitations. [Report bugs](https://github.com/BastiQ/dash-text-annotate/issues) with a minimal Dash app, version details, and synthetic sample text.

## License

[MIT](https://github.com/BastiQ/dash-text-annotate/blob/main/LICENSE). Powered by [Recogito Text Annotator](https://github.com/recogito/text-annotator-js), using Dash's own React instance. Bundled libraries and their licenses are listed in [third-party notices](https://github.com/BastiQ/dash-text-annotate/blob/main/THIRD_PARTY_NOTICES.md). Thanks to the original `react-text-annotate` project and the Dash component tooling.
