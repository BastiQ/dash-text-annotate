/** Pure annotation data boundary. Public offsets are Python code points by default. */
export function offsetMap(text) {
  const boundaries = [0];
  let position = 0;
  for (const char of text) {
    position += char.length;
    boundaries.push(position);
  }
  return boundaries;
}

export function normalizeEntities(text, entities = [], unit = 'codepoint') {
  if (typeof text !== 'string') throw new Error('text must be a string.');
  if (!['codepoint', 'utf16'].includes(unit)) throw new Error('Unknown offset_unit.');
  if (entities == null) entities = [];
  if (!Array.isArray(entities)) throw new Error('entities must be a list.');
  const boundaries = offsetMap(text);
  const validBoundaries = new Set(boundaries);
  const length = unit === 'codepoint' ? boundaries.length - 1 : text.length;
  const ids = new Set();
  return entities.map((entity, index) => {
    const prefix = `Annotation ${index + 1}: `;
    if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
      throw new Error(prefix + 'expected an object.');
    }
    const {start, end, tag} = entity;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= end || end > length) {
      throw new Error(prefix + `offsets must satisfy 0 ≤ start < end ≤ ${length}.`);
    }
    if (unit === 'utf16' && (!validBoundaries.has(start) || !validBoundaries.has(end))) {
      throw new Error(prefix + 'offsets cannot split a Unicode character.');
    }
    if (typeof tag !== 'string' || !tag.trim()) throw new Error(prefix + 'tag must be a non-empty string.');
    if (entity.color != null && typeof entity.color !== 'string') throw new Error(prefix + 'color must be a string.');
    const quote = text.slice(unit === 'codepoint' ? boundaries[start] : start, unit === 'codepoint' ? boundaries[end] : end);
    if (entity.text != null && entity.text !== quote) throw new Error(prefix + 'text does not match the source document.');
    const id = entity.id ?? `legacy-${index}-${start}-${end}`;
    if (typeof id !== 'string' || !id || ids.has(id)) throw new Error(prefix + 'id must be a unique non-empty string.');
    ids.add(id);
    return {...entity, id, start, end, tag, text: quote};
  });
}

export function toRecogito(text, entities, unit) {
  const boundaries = offsetMap(text);
  return entities.map(entity => ({
    id: entity.id,
    bodies: [{id: `${entity.id}-tag`, annotation: entity.id, purpose: 'tagging', value: entity.tag}],
    target: {
      annotation: entity.id,
      selector: [{
        start: unit === 'codepoint' ? boundaries[entity.start] : entity.start,
        end: unit === 'codepoint' ? boundaries[entity.end] : entity.end,
        quote: entity.text,
      }],
    },
  }));
}

export function fromSelection(text, annotation, tag, colors, unit) {
  const selectors = annotation.target?.selector;
  if (!Array.isArray(selectors) || selectors.length !== 1) throw new Error('Select one continuous passage.');
  const {start, end} = selectors[0];
  const boundaries = offsetMap(text);
  const entity = {
    id: annotation.id,
    start: unit === 'codepoint' ? boundaries.indexOf(start) : start,
    end: unit === 'codepoint' ? boundaries.indexOf(end) : end,
    tag,
    ...(colors?.[tag] ? {color: colors[tag]} : {}),
  };
  return normalizeEntities(text, [entity], unit)[0];
}

export function sameEntities(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

// Pure history: local edits are reversible; authoritative external updates reset it.
export function createHistory(value) {
  return {past: [], present: value, future: []};
}
export function editHistory(history, value) {
  if (sameEntities(history.present, value)) return history;
  return {past: [...history.past.slice(-99), history.present], present: value, future: []};
}
export function undoHistory(history) {
  if (!history.past.length) return history;
  return {past: history.past.slice(0, -1), present: history.past.at(-1), future: [history.present, ...history.future]};
}
export function redoHistory(history) {
  if (!history.future.length) return history;
  return {past: [...history.past, history.present], present: history.future[0], future: history.future.slice(1)};
}
