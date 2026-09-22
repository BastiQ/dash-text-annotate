# Passage label renderer

`src/lib/label-renderer.mjs` is the integration boundary with Recogito. It imports
`createRenderer` and `computeStyle` from the public `@recogito/text-annotator`
entry point. Recogito retains selection, span geometry, annotation state, and
scroll/resize observation. Our painter owns the highlight and badge elements,
badge interactions, collision layout, and cleanup. It does not depend on
Recogito's generated element names, private imports, or the inline-markers plugin.

`show_labels=True` is the default. With labels hidden, highlights and annotation
data remain available. Changing the option redraws the renderer without replacing
the annotator or resetting history. The toolbar and annotation list have separate
visibility options. Keep the toolbar for keyboard creation; badges support
keyboard selection with native buttons, including read-only review.

Both drawing layers are siblings of the immutable document. The source contains
only one text span; label text cannot enter source offsets, copied selections,
or exported annotations. Text is rendered with `textContent`, never interpreted
as HTML. Highlights sit behind the source glyphs, and badges use a separate layer.

Badges anchor above the first rectangle of a passage, including passages that
wrap across lines. `label-layout.mjs` packs collisions into rows and clamps long
labels to the available width. The document reserves a uniform amount of line
spacing for the largest stack. Layout considers offscreen annotations too, so
scrolling does not change this spacing. Dense annotation sets can therefore
require substantial space; hide labels for a compact review. Source text and
offsets remain unchanged in both modes.

Badge nodes persist across redraws to retain keyboard focus. Removing a focused
badge returns focus to the document. The painter guards queued redraws after
destruction, removes its overlays, and unregisters its font-loading listener.
Recogito's renderer helper owns and removes its own observers and event listeners.

## Upgrading Recogito

The exact Recogito version and dependency tree are locked, and the built assets
ship in the Python wheel. Installing this package does not fetch a newer renderer.
Upstream releases affect us only when maintainers upgrade and rebuild.

Before accepting an upgrade, inspect the public `RendererFactory`, `Painter`,
`Highlight`, annotation store geometry, and selection contracts. Run the JS
layout tests, rebuild Python bindings/assets, then run browser regressions against
installed wheels on the supported Dash versions. Check:

- Mouse and keyboard creation, Unicode offsets, and unchanged source text.
- Badge selection, relabeling, read-only behavior, and metadata preservation.
- Toggling labels while retaining selection and undo/redo history.
- Overlaps, wrapped text, long labels, resizing, and scroll alignment.
- Document replacement and removal of another component without orphan overlays.

These exported interfaces reduce coupling; they do not guarantee future changes
will require no adaptation. Keep that adaptation in this module and its tests.
