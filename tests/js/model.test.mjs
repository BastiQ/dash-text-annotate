import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeEntities, toRecogito, fromSelection, createHistory, editHistory, undoHistory, redoHistory, sameEntities, findPassageMatches} from '../../src/lib/model.mjs';

test('optional and null entities are safe empty values', () => {
  assert.deepEqual(normalizeEntities('Hello'), []);
  assert.deepEqual(normalizeEntities('Hello', null), []);
});
test('Unicode offsets round-trip through the browser and Python conventions', () => {
  const text = '😀 Acme\n你好 e\u0301';
  const values = normalizeEntities(text, [{start: 2, end: 6, tag: 'ORG', note: 'keep'}]);
  const [annotation] = toRecogito(text, values, 'codepoint');
  assert.equal(annotation.target.selector[0].start, 3);
  assert.equal(annotation.target.selector[0].end, 7);
  assert.deepEqual(fromSelection(text, annotation, 'ORG', {}, 'codepoint'), {
    id: values[0].id, start: 2, end: 6, tag: 'ORG', text: 'Acme',
  });
  assert.equal(values[0].note, 'keep');
});
test('legacy UTF-16 input is supported without splitting surrogate pairs', () => {
  const values = normalizeEntities('😀 Acme', [{start: 3, end: 7, tag: 'ORG'}], 'utf16');
  assert.equal(values[0].text, 'Acme');
  assert.throws(() => normalizeEntities('😀', [{start: 0, end: 1, tag: 'X'}], 'utf16'), /Unicode/);
});
test('invalid and stale annotations never enter the rendering engine', () => {
  for (const [start, end] of [[null, 2], [NaN, 2], [-1, 2], [0, 7], [2, 2], [3, 2], [0.5, 2]]) {
    assert.throws(() => normalizeEntities('abcdef', [{start, end, tag: 'X'}]), /offsets/);
  }
  assert.throws(() => normalizeEntities('abc', [{start: 0, end: 2, tag: 'X', text: 'stale'}]), /source/);
  assert.throws(() => normalizeEntities('abc', [{start: 0, end: 2, tag: ''}]), /tag/);
  assert.throws(() => normalizeEntities('abc', [{id:'x',start:0,end:1,tag:'A'}, {id:'x',start:1,end:2,tag:'B'}]), /unique/);
});
test('overlaps and identical ranges with different tags stay independent', () => {
  const values = normalizeEntities('abcdef', [{start: 1, end: 4, tag: 'A'}, {start: 2, end: 5, tag: 'B'}, {start: 1, end: 4, tag: 'C'}]);
  assert.deepEqual(values.map(e => e.text), ['bcd', 'cde', 'bcd']);
  assert.equal(new Set(values.map(e => e.id)).size, 3);
  assert.equal(toRecogito('abcdef', values, 'codepoint').length, 3);
});
test('undo, redo and branching preserve data and bound memory', () => {
  let history = editHistory(createHistory([]), [{id: 'first'}]);
  history = editHistory(history, [{id: 'second'}]);
  history = undoHistory(history);
  assert.deepEqual(history.present, [{id: 'first'}]);
  assert.deepEqual(redoHistory(history).present, [{id: 'second'}]);
  history = editHistory(history, [{id: 'branch'}]);
  assert.equal(history.future.length, 0);
  for (let i=0; i<120; i++) history = editHistory(history, [{id: String(i)}]);
  assert.equal(history.past.length, 100);
});

test('server echoes ignore object key order while preserving meaningful changes', () => {
  const original = normalizeEntities('Acme', [{id: 'x', start: 0, end: 4, tag: 'ORG',
    metadata: {reviewed: true, labels: ['a', 'b']}}]);
  const echo = normalizeEntities('Acme', [{metadata: {labels: ['a', 'b'], reviewed: true},
    text: 'Acme', tag: 'ORG', end: 4, start: 0, id: 'x'}]);
  assert.equal(sameEntities(original, echo), true);
  const history = editHistory(createHistory([]), original);
  assert.equal(editHistory(history, echo), history);
  assert.deepEqual(undoHistory(history).present, []);
  assert.equal(sameEntities(original, [{...echo[0], tag: 'PERSON'}]), false);
  assert.equal(sameEntities(original, [{...echo[0], metadata: {reviewed: true, labels: ['b', 'a']}}]), false);
  assert.equal(sameEntities(original, [{...echo[0], metadata: null}]), false);
  assert.equal(sameEntities([{id: 'a'}, {id: 'b'}], [{id: 'b'}, {id: 'a'}]), false);
  assert.equal(sameEntities([], {}), false);
});

test('multiline passage search preserves source line endings and Unicode offsets', () => {
  for (const newline of ['\n', '\r\n', '\r']) {
    const text = `😀 Berlin.${newline}Acme returns.`;
    const [match] = findPassageMatches(text, 'Berlin.\nAcme');
    assert.deepEqual(match, {start: 3, end: 14 + newline.length});
    const entity = fromSelection(text, {id: 'multiline', target: {selector: [match]}}, 'ORG', {}, 'codepoint');
    assert.equal(entity.start, 2);
    assert.equal(entity.end, 13 + newline.length);
    assert.equal(entity.text, `Berlin.${newline}Acme`);
  }
  assert.deepEqual(findPassageMatches('aaaa', 'aa'), [{start: 0, end: 2}, {start: 1, end: 3}, {start: 2, end: 4}]);
  assert.deepEqual(findPassageMatches('a\nb', 'a\r\nb'), [{start: 0, end: 3}]);
  assert.deepEqual(findPassageMatches('abc', ''), []);
  assert.deepEqual(findPassageMatches('abc', 'd'), []);
});
