import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutLabels, inlineLabelSlots, sourceParts} from '../../src/lib/label-layout.mjs';

const badge = (id, x, y = 40, badgeWidth = 42) => ({id, x, y, height: 18, badgeWidth, badgeHeight: 20});
test('distinct passages share a label row without moving their anchors', () => {
  const {placements, space} = layoutLabels([badge('b', 140), badge('a', 20)], 16, 280);
  assert.equal(space, 24);
  assert.deepEqual(placements.map(({id, left, top}) => ({id, left, top})), [
    {id: 'a', left: 20, top: 16}, {id: 'b', left: 140, top: 16},
  ]);
});

test('bottom labels reserve rows below the last passage line', () => {
  const {placements, space} = layoutLabels([badge('a', 20), badge('b', 20)], 16, 280, 'bottom');
  assert.equal(space, 48);
  assert.deepEqual(placements.map(item => item.top), [62, 86]);
});

test('left and right slots reserve space at source boundaries without adding text', () => {
  const text = '😀 Acme\nAcme';
  const items = [{...badge('first', 20), start: 3, end: 7}, {...badge('overlap', 20), start: 3, end: 7},
    {...badge('second', 20), start: 8, end: 12}];
  for (const position of ['left', 'right']) {
    const slots = inlineLabelSlots(items, position, 200);
    assert.deepEqual(slots.map(slot => slot.offset), position === 'left' ? [3, 3, 8] : [7, 7, 12]);
    assert.deepEqual(slots.map(slot => slot.width), [50, 50, 50]);
    assert.equal(sourceParts(text, slots).filter(part => typeof part === 'string').join(''), text);
  }
  assert.deepEqual(inlineLabelSlots(items, 'top', 200), []);
  assert.deepEqual(inlineLabelSlots(items, 'bottom', 200), []);
  assert.equal(inlineLabelSlots(items, 'right', 30)[0].width, 30);
  assert.deepEqual(sourceParts(text, []), [text]);
});
test('overlapping labels get independent rows and later lines reuse those rows', () => {
  const {placements, space} = layoutLabels([badge('a', 20), badge('b', 20), badge('c', 35), badge('d', 20, 150)], 16, 280);
  assert.equal(space, 72);
  assert.deepEqual(placements.map(item => item.top), [16, -8, -32, 126]);
  assert.equal(placements[0].left, placements[1].left);
});
test('long labels and right-edge anchors stay inside a narrow document', () => {
  const {placements} = layoutLabels([badge('long', 20, 40, 400), badge('end', 185)], 16, 200);
  assert.equal(placements[0].width, 184);
  assert.equal(placements[1].left, 158);
  for (const item of placements) {
    assert.ok(item.left >= 16);
    assert.ok(item.left + item.width <= 200);
  }
  assert.deepEqual(layoutLabels([], 16, 200), {placements: [], space: 0});
});
