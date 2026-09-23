# Migrating from 0.0.1 to 0.1

This is a breaking release. Keep a copy of your saved data and test on a small document first.

## Runtime and imports

Use Python 3.10+ with Dash 3 or 4. The package now declares Dash as a dependency and includes its compiled JS/CSS. Replace `import dash_html_components as html` and `import dash_core_components as dcc` with `from dash import html, dcc`. Use `app.run(...)` in development instead of the removed `app.run_server(...)`.

The public import stays `from dash_text_annotate import DashTextAnnotate`. The primary props `text`, `entities`, `tag`, and `tag_colors` are retained. `entities`, `tag`, and `tag_colors` now have safe defaults. The unused ExampleComponent and untested R/Julia template bindings have been removed; this release supports Python Dash.

## Unicode offsets — choose one explicit strategy

The old React engine emitted JavaScript UTF-16 positions. The new default is Python code points. ASCII/BMP-only documents have identical positions; emoji and some other characters do not.

For `text = "😀 Acme"`, the old Acme span is `[3, 7)`. The new default is `[2, 6)`, matching `text[2:6]` in Python.

**Recommended: migrate stored records once.**

```python
from dash_text_annotate import convert_offsets

converted = convert_offsets(text, old_entities, "utf16", "codepoint")
# Save converted together with the exact original text and offset_unit="codepoint".
```

**Compatibility option:** pass `offset_unit="utf16"` to keep reading and writing old positions. Do not then use these positions directly in Python string slices. `validate_entities(..., offset_unit="utf16")` checks surrogate boundaries.

Do not apply conversion twice. Record the offset unit in your saved format.

## Safer editing

Clicking a highlight selects it; deletion is explicit and undoable. Overlaps now preserve source text. Stable IDs let identical ranges with different labels be edited independently. Persist returned IDs, quotes, and custom fields. Old input without IDs is still accepted, but generated legacy IDs depend on the input order until you save them.

Incoming null, fractional, reversed, or out-of-bounds offsets are rejected. A supplied quote must match the source. Listen to the `error` prop for reporting, and validate on the server before persistence. The frontend read-only setting does not replace server permissions.

Return a document's `text`, `entities`, and `document_id` together. A changed source with unchanged entities clears previous spans. An external annotation replacement clears local undo history. Save before switching documents; the component does not own storage.

## Styling

The component preserves newlines with `white-space: pre-wrap`; remove old `pre-line` workarounds if they are no longer needed. CSS is scoped to `.dta`. Fonts inherit from the host app. `style`, `className`, and theme variables are supported; internal markup changed, so old selectors for react-text-annotate must be replaced.

The engine is now Recogito Text Annotator. This package adapts plain-text spans; it does not expose the entire Recogito API or W3C JSON-LD annotation model. The Python-facing span format remains intentionally small.
