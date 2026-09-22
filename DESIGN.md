# Design

## Context

A researcher reads and labels clauses at a desk in daylight. The demo uses a
light reading surface; the component inherits the host application's theme.

## Color and typography

Restrained warm neutral surfaces with a dark teal action accent. Annotation
colors identify categories, always accompanied by text labels. System sans-serif
controls and readable document text; source passages retain their whitespace.
Colors and spacing are exposed through scoped CSS custom properties.

## Structure

The document is the primary surface. A compact toolbar precedes it. Annotation
rows follow it, with explicit review, relabel, and delete controls. No nested
cards, decorative gradients, remote fonts, or entrance animations.

## Interaction

Visible focus rings, generous targets, wrapped controls at narrow widths,
disabled states, inline errors, and a polite live region. Deletion is explicit;
clicking a highlight selects it. Undo and redo remain local to one document.
