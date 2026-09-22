/** Pack badges above/below their source line without shifting their anchors. */
export function layoutLabels(items, left, right, position = 'top', gap = 4) {
  const lines = [];
  const placements = [];
  const rowHeight = Math.max(0, ...items.map(item => item.badgeHeight)) + gap;
  let rows = 0;
  for (const item of [...items].sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id))) {
    let line = lines.find(line => Math.abs(line.y - item.y) < Math.max(2, item.height / 3));
    if (!line) {
      line = {y: item.y, ends: []};
      lines.push(line);
    }
    const width = Math.min(item.badgeWidth, Math.max(0, right - left));
    const anchor = Math.max(left, Math.min(item.x, right - width));
    let row = line.ends.findIndex(end => end + gap <= anchor);
    // Keep each badge aligned to its passage rather than sliding it over another.
    if (row === -1) row = line.ends.length;
    line.ends[row] = anchor + width;
    rows = Math.max(rows, row + 1);
    const top = position === 'bottom' ? item.y + item.height + gap + row * rowHeight
      : item.y - gap - item.badgeHeight - row * rowHeight;
    placements.push({...item, left: anchor, top, width});
  }
  return {placements, space: rows * rowHeight};
}

/** Empty inline slots flow with the text; their buttons remain outside the source. */
export function inlineLabelSlots(items, position, availableWidth, gap = 4) {
  if (position !== 'left' && position !== 'right') return [];
  return items.map(item => ({id: item.id,
    offset: position === 'left' ? item.start : item.end,
    width: Math.min(item.badgeWidth + 2 * gap, availableWidth),
  })).sort((a, b) => a.offset - b.offset || a.id.localeCompare(b.id));
}

/** Split at browser UTF-16 offsets, retaining every original character exactly. */
export function sourceParts(text, slots) {
  const parts = [];
  let offset = 0;
  for (const slot of slots) {
    if (slot.offset > offset) parts.push(text.slice(offset, slot.offset));
    parts.push(slot);
    offset = slot.offset;
  }
  if (offset < text.length) parts.push(text.slice(offset));
  return parts;
}
