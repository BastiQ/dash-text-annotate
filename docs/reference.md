# Component reference

[← README](../README.md)

Behavior, annotation data, and properties for `DashTextAnnotate`. For a runnable app, see the [quick start](../README.md#quick-start).

## Editing and review

- Select text with the mouse to apply the active `tag`.
- Open **Find a passage**, enter exact text (including line breaks), choose an occurrence, and press Ctrl+Enter / ⌘+Enter or **Add annotation**. Enter inserts a line break. Search accepts LF, CRLF, and CR line endings while preserving the original text and offsets. This also works without a mouse.
- Select a passage badge, highlight, or annotation row, then **Apply label** or **Delete selected**. Clicking a highlight never deletes it.
- Category badges appear to the right of each passage by default. Set `label_position` to `"left"`, `"right"`, `"top"`, or `"bottom"`. Left/right badges flow before/after the passage and wrap with the text when space is limited. Top/bottom badges anchor to the first/last line; overlapping badges stack with reserved line spacing. Long labels are visually truncated; their full label and passage remain available to assistive technology and in the annotation list. `show_labels=False` hides badges and removes their reserved space. Both properties can change in callbacks without resetting annotations or undo history.
- **Undo / Redo** retain the last 100 local edits. With focus in the component, Ctrl/Cmd+Z undoes; Ctrl/Cmd+Shift+Z redoes. Text inputs retain their normal shortcuts.
- Overlapping spans and identical spans with different tags are independent. Badges and the list give access to each overlapping annotation.
- `read_only=True` keeps selection and review available while disabling editing.

Whitespace and newlines are preserved. Only plain text is supported; HTML strings display as text. The widget does not supply document storage, authentication, collaboration, relations, discontinuous spans, or a rich-text editor. See [scope and alternatives](ecosystem.md).

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
| `show_labels` | `True` | Selectable category badges, independent of the toolbar and annotation list. |
| `label_position` | `"right"` | Badge position: `"left"`, `"right"`, `"top"`, or `"bottom"`. Only affects visible passage badges. |
| `selected_id` | `None` | Output: current selected annotation ID. For overlapping highlights, use a badge or list row to select an individual record. |
| `error` | `None` | Output: incoming-data validation error. |
| `id` | Unset | String or Dash pattern-matching dictionary ID. |
| `className`, `style` | Unset | Root CSS class and style. |
| `aria_label` | `"Text annotation"` | Accessible name for the widget. |

CSS is scoped to `.dta`; font and text color inherit from your app. Override `--dta-accent`, `--dta-border`, and `--dta-surface` on your component class to match a theme. Badge surfaces and text use `--dta-label-surface` and `--dta-label-text`; their category color comes from the existing `color` / `tag_colors` properties.

An isolated renderer uses Recogito's exported renderer API. Its overlays live outside the source text, so badge text never changes offsets or copied passages. The renderer and its upgrade checks are described in [renderer maintenance](renderer.md). React is supplied by Dash; no inline-markers plugin or fork is needed.

