/** Pack badges above their source line, preserving an anchor at each span's start. */
export function layoutLabels(items, left, right, gap = 4) {
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
    placements.push({...item, left: anchor, top: item.y - gap - item.badgeHeight - row * rowHeight, width});
  }
  return {placements, space: rows * rowHeight};
}
