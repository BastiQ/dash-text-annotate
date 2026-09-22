# Dash Text Annotate

An open-source **text span annotation component for Dash**. Select a passage, assign a label, and receive structured annotations in Python callbacks. It preserves the source text, supports overlapping labels, and runs entirely within your Dash app.

The 0.1 series replaces the unmaintained `react-text-annotate` dependency with [Recogito Text Annotator](https://github.com/recogito/text-annotator-js), exposed through a small React component using Dash's own React instance.

> **0.1.0 is a new, breaking development release.** Install this checkout until it is published. Existing 0.0.1 users should read the [migration guide](docs/migration.md), especially the Unicode offset change.

## Install and run

Requires Python 3.10+ and Dash 3 or 4. The Python package includes its JavaScript and CSS; end users do not need Node.js or a CDN.

```sh
# From this repository checkout:
python -m pip install .
python usage.py
```

Open <http://127.0.0.1:8050>. The demo supports per-document session saving, reload, JSON export/import, and read-only review. Save before switching documents. Browser-session storage is a demonstration; your app can use its own database or files.

## A complete small app

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

## Editing and review

- Select text with the mouse to apply the active `tag`.
- Open **Find a passage**, enter exact text, choose an occurrence, and press Enter or **Add annotation**. This also works without a mouse.
- Select a highlight or annotation row, then **Apply label** or **Delete selected**. Clicking a highlight never deletes it.
- **Undo / Redo** retain the last 100 local edits. With focus in the component, Ctrl/Cmd+Z undoes; Ctrl/Cmd+Shift+Z redoes. Text inputs retain their normal shortcuts.
- Overlapping spans and identical spans with different tags are independent. The list gives access to every overlapping annotation.
- `read_only=True` keeps selection and review available while disabling editing.

Whitespace and newlines are preserved. Only plain text is supported; HTML strings display as text. The widget does not supply document storage, authentication, collaboration, relations, discontinuous spans, or a rich-text editor. See [scope and alternatives](docs/ecosystem.md).

## Data contract

`entities` is an optional list of objects; `None` is treated as an empty list.

| Field | Meaning |
| --- | --- |
| `start`, `end` | Required integer offsets, `0 <= start < end <= len(text)` in code-point mode. |
| `tag` | Required non-empty label string. |
| `id` | Unique string. New annotations get UUIDs; legacy input without IDs gets deterministic IDs. Persist IDs with your annotations. |
| `text` | Exact source quote. Filled when omitted; rejected when supplied but inconsistent with the source. |
| `color` | Optional CSS color. Overrides the label's color in `tag_colors`. |
| Other fields | JSON metadata retained on existing records during relabel, delete/undo, and callback round trips. |

Invalid input produces an inline message and an `error` callback value, disables edits, and leaves the document readable. Correcting `entities` clears the error. The component does not emit partially accepted data or silently repair invalid offsets.

Validate data in Python before loading or saving it:

```python
from dash_text_annotate import validate_entities, convert_offsets

clean = validate_entities(text, entities)
# Convert saved 0.0.1 browser offsets once; existing IDs and extra fields survive.
clean = convert_offsets(text, legacy_entities, from_unit="utf16", to_unit="codepoint")
```

Store the immutable source text (or a verified document version/hash), document ID, offset unit, and annotations together. Offsets alone cannot detect every edit to the source. Never normalize whitespace or Unicode between saving and reloading.

When changing documents, return `text`, `entities`, and `document_id` in the **same callback**. If the document or offset unit changes while `entities` stays equal to the previous value, the widget clears those stale spans and its undo history. Give a new document its own annotation IDs; unchanged values are conservatively treated as belonging to the previous document. External changes to the annotation set reset local undo history; echoes of local edits preserve it.

## Component properties

| Property | Default | Purpose |
| --- | --- | --- |
| `text` | Required | Immutable plain-text document. |
| `entities` | `[]` | Controlled annotation list and callback output. |
| `tag` | `"LABEL"` | Label for new passages and relabeling. |
| `tag_colors` | `{}` | Label-to-CSS-color mapping. |
| `document_id` | Unset | Identity/version for switching documents. |
| `offset_unit` | `"codepoint"` | `"codepoint"` or `"utf16"`. |
| `read_only` | `False` | Disable editing. This is a UI setting, not server authorization. |
| `show_toolbar` | `True` | Editing controls and accessible passage search. Keep enabled for keyboard annotation. |
| `show_annotations` | `True` | Selectable list of labelled passages. |
| `selected_id` | `None` | Output: current selected annotation ID. For overlapping highlights, use the list to select an individual record. |
| `error` | `None` | Output: incoming-data validation error. |
| `id` | Unset | String or Dash pattern-matching dictionary ID. |
| `className`, `style` | Unset | Root CSS class and style. |
| `aria_label` | `"Text annotation"` | Accessible name for the widget. |

CSS is scoped to `.dta`; font and text color inherit from your app. Override `--dta-accent`, `--dta-border`, and `--dta-surface` on your component class to match a theme. The SPANS renderer is used for independent instances and overlapping highlights. Bundle size is about 70 KB of minified JavaScript before compression, with React supplied by Dash.

## Development and support

See [CONTRIBUTING.md](CONTRIBUTING.md) for a clean build, test commands, and release checks, and the [validation record](docs/validation.md) for what has been verified locally. CI builds the frontend, checks generated files, builds an sdist/wheel, tests installed-wheel asset serving, and runs Chrome scenarios on Dash 3 and 4. Modern desktop browsers are the target; touch behavior and screen-reader combinations need broader user testing before accessibility conformance claims.

Report bugs with a minimal Dash app, Python/Dash/browser versions, and synthetic sample text. See the [changelog](CHANGELOG.md) and [migration guide](docs/migration.md).

MIT licensed. The bundled Recogito/Annotorious libraries use BSD-3-Clause; full third-party notices ship with the package. Thanks to the original `react-text-annotate` project and the Dash component tooling that made the first version possible.
