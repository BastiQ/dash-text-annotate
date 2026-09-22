# Changelog

## 0.1.0 — Unreleased

### Breaking changes

- Python 3.10+ and Dash 3/4 are required and declared in package metadata.
- Unicode code-point offsets replace UTF-16 offsets by default. `offset_unit="utf16"` and `convert_offsets` support migration.
- Recogito replaces the old React annotation engine. Highlight clicks select; deletion is explicit.
- Invalid or stale spans are rejected. Changed documents clear unchanged old spans and editing history.
- Remove unused ExampleComponent, R/Julia scaffold bindings, hot-reload bundles, and obsolete webpack tooling.

### Added and fixed

- Correct overlapping annotations, preserved whitespace, stable IDs, Python validation/conversion helpers, and extra-field preservation.
- Safe defaults, read-only review, selection/error callbacks, undo/redo, relabeling, accessible exact-passage search, scoped themes, and pattern-matching IDs.
- Session-isolated save/reload and JSON import/export demo with current Dash imports and run API.
- Locked frontend build, current metadata generation, packaged licenses, generated Python typing, local JS/CSS, package/browser regression tests, CI, and release guidance.
- Reject selections that cross the document boundary instead of emitting null offsets.
- Preserve undo history and stale-document protection when callbacks reorder JSON fields.
- Support keyboard annotation across line breaks, including CRLF source text, without changing source offsets.

## 0.0.1 — Historical prototype

Initial Dash wrapper around react-text-annotate.
