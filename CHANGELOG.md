# Changelog

## 0.1.0 — Unreleased

### Breaking changes

- Python 3.10+ and Dash 3/4 are required and declared in package metadata.
- Unicode code-point offsets replace UTF-16 offsets by default. `offset_unit="utf16"` and `convert_offsets` support migration.
- Recogito replaces the old React annotation engine. Highlight clicks select; deletion is explicit.
- Invalid or stale spans are rejected. Changed documents clear unchanged old spans and editing history.
- Remove unused ExampleComponent, R/Julia scaffold bindings, hot-reload bundles, and obsolete webpack tooling.

### Added and fixed

- PyPI-ready installation instructions and metadata links, version-aligned wheel/sdist checks, and a Trusted Publishing workflow gated by the full CI matrix. Includes a release guide and Dash community announcement draft.
- Browser checks retry transient DOM replacement during document switching.
- Optional selectable passage labels (`show_labels=True` by default), isolated renderer, overlap layout, and a live demo toggle. Hiding labels preserves edits and undo history.
- Configurable `label_position` (`left`, `right`, `top`, `bottom`, default `right`), with inline space for side badges and a live demo selector. Position changes preserve source offsets, selection, and undo history.
- Correct overlapping annotations, preserved whitespace, stable IDs, Python validation/conversion helpers, and extra-field preservation.
- Safe defaults, read-only review, selection/error callbacks, undo/redo, relabeling, accessible exact-passage search, scoped themes, and pattern-matching IDs.
- Session-isolated save/reload and JSON import/export demo with current Dash imports and run API.
- Locked frontend build, current metadata generation, packaged licenses, generated Python typing, local JS/CSS, package/browser regression tests, CI, and release guidance.
- Reject selections that cross the document boundary instead of emitting null offsets.
- Preserve undo history and stale-document protection when callbacks reorder JSON fields.
- Support keyboard annotation across line breaks, including CRLF source text, without changing source offsets.

## 0.0.1 — Historical prototype

Initial Dash wrapper around react-text-annotate.
