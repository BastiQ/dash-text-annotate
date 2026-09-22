# Scope and ecosystem review

Reviewed 22 September 2026. Maintenance dates are snapshots, not guarantees. This project aims to be a small, usable Dash widget for immutable plain-text span labeling.

| Project | Useful capability | Relationship to this package |
| --- | --- | --- |
| [Recogito Text Annotator](https://github.com/recogito/text-annotator-js) | Overlapping text ranges, selection lifecycle, stable annotation identity, a maintained annotation engine. | Adopted its core in a thin React/Dash adapter. The core avoids the extra React-wrapper dependency surface. |
| [react-text-annotate](https://github.com/mcamac/react-text-annotate) | Original lightweight controlled span component. Latest npm version 0.3.0 was released in 2020. | Replaced because its selection assumptions and old React peer requirement made it a weak foundation for renewed maintenance. |
| [dash-annotator](https://github.com/rileymjohnson/dash-annotator) | A Dash wrapper for highlights and text/HTML/PDF display. | Closest native comparison found; its small repository and lack of published releases did not provide a clearly maintained drop-in replacement. |
| [Dash Mantine Highlight](https://www.dash-mantine-components.com/components/highlight) | Display matching substrings with styled highlights. | Prefer it for read-only search highlighting; manual annotation needs ranges, identity, edits, and callbacks. |
| [Dash Mantine RichTextEditor](https://www.dash-mantine-components.com/components/richtexteditor) | Rich-text authoring with TipTap. | Prefer it when the text itself must be edited; changing source text requires a different anchoring model. |
| [doccano](https://github.com/doccano/doccano), [Label Studio](https://github.com/HumanSignal/label-studio) | Complete labeling applications and dataset workflows. | Prefer a full platform for managed projects, annotator teams, assignment, and review. This widget leaves those responsibilities to the Dash app. |
| [Dash All-in-One components](https://dash.plotly.com/all-in-one-components), [Dash hooks](https://dash.plotly.com/dash-plugins-using-hooks) | Reusable app composition and app-wide integration. | Useful for a future higher-level document workflow; unnecessary for the core component's current boundary. |

## Priorities adopted

- Reproducible source builds, pinned frontend dependencies, generated Python bindings, local assets, explicit runtime requirements.
- Callback behavior, stable IDs, overlap correctness, Unicode offset contracts, invalid-data handling, document replacement, and preserved metadata.
- Explicit deletion, undo/redo, read-only review, accessible controls and passage search, scoped styling.
- A complete save/reload/export/import demo, migration guidance, package tests, browser regression cases, CI, dependency updates, and a release checklist.

## Deliberate boundaries

The package does not ship a database, authentication, simultaneous multi-user editing, adjudication, relations, discontinuous spans, HTML/PDF annotation, or model inference. Add these at the app level or select a fuller platform. A future adapter for the W3C Web Annotation format should be explicit; the small Python span schema is not presented as W3C-compatible JSON-LD.

Before declaring 1.0, gather testing with real datasets, long documents, assistive technology, touch devices, and downstream apps. The current 0.1 release is a beta with regression coverage, not a claim that every browser or annotation workflow is supported.
