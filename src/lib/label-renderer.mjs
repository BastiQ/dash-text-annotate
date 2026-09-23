import {createRenderer, computeStyle} from '@recogito/text-annotator';
import {layoutLabels, inlineLabelSlots, sourceParts} from './label-layout.mjs';

// This is the only renderer integration boundary. Import from the public package
// entry point; do not query or patch Recogito's generated DOM or private modules.
export function labelRenderer({getOptions, onSelect, onSourceChange}) {
  return (container, state, viewport) => {
    const frame = container.parentElement;
    const source = container.querySelector('.dta-source');
    const text = source.textContent;
    const highlightsLayer = document.createElement('div');
    highlightsLayer.className = 'dta-highlights';
    highlightsLayer.setAttribute('aria-hidden', 'true');
    const labelsLayer = document.createElement('div');
    labelsLayer.className = 'dta-labels';
    labelsLayer.setAttribute('role', 'group');
    labelsLayer.setAttribute('aria-label', 'Passage labels');
    // Sibling overlays keep badge text out of source offsets, selections and copies.
    frame.append(highlightsLayer, labelsLayer);
    const badges = new Map();
    let destroyed = false;
    let visible = true;
    let space = 0;
    let lastHighlights = '';
    let lastSlots = '[]';
    const slots = new Map();
    let renderer;
    const px = value => `${Math.round(value * 100) / 100}px`;

    function style(element, key, value) {
      if (element.style.getPropertyValue(key) !== value) element.style.setProperty(key, value);
    }
    function attribute(element, key, value) {
      if (element.getAttribute(key) !== value) element.setAttribute(key, value);
    }
    function redraw(highlights, _bounds, currentStyle, overrides) {
      if (destroyed) return; // The upstream helper can have a queued animation frame.
      if (!visible) return;
      const {showLabels, labelPosition} = getOptions();
      const inline = labelPosition === 'left' || labelPosition === 'right';
      const focused = document.activeElement;
      if (labelsLayer.hidden === showLabels) labelsLayer.hidden = !showLabels;
      const docBounds = container.getBoundingClientRect();
      const frameBounds = frame.getBoundingClientRect();
      const dx = docBounds.left - frameBounds.left;
      const dy = docBounds.top - frameBounds.top;
      const css = getComputedStyle(container);
      const left = parseFloat(css.paddingLeft) + parseFloat(css.borderLeftWidth);
      const right = docBounds.width - parseFloat(css.paddingRight) - parseFloat(css.borderRightWidth);
      style(labelsLayer, 'font-size', css.fontSize);
      style(labelsLayer, 'font-family', css.fontFamily);
      const selected = new Set(state.selection.selected.map(value => value.id));
      const liveIds = new Set();
      const items = [];

      // Layout all annotations, including offscreen ones. Scrolling must not change
      // reserved line spacing or shift the document under the user's pointer.
      if (showLabels) for (const annotation of state.store.all()) {
        const rects = state.store.getAnnotationRects(annotation.id);
        const rect = labelPosition === 'bottom' ? rects.at(-1) : rects[0];
        const tag = annotation.bodies.find(body => body.purpose === 'tagging')?.value;
        if (!rect || !tag) continue;
        liveIds.add(annotation.id);
        let badge = badges.get(annotation.id);
        if (!badge) {
          badge = document.createElement('button');
          badge.type = 'button';
          badge.className = 'dta-label-button';
          badge.dataset.annotation = annotation.id;
          badge.addEventListener('click', () => {
            window.getSelection()?.removeAllRanges();
            onSelect(annotation.id);
          });
          labelsLayer.appendChild(badge);
          badges.set(annotation.id, badge);
        }
        if (badge.textContent !== tag) badge.textContent = tag;
        const quote = annotation.target.selector.map(selector => selector.quote).join(' ');
        attribute(badge, 'aria-label', `Select ${tag}: ${quote}`);
        attribute(badge, 'aria-pressed', String(selected.has(annotation.id)));
        attribute(badge, 'title', `${tag}: ${quote}`);
        const highlight = {annotation, rects: [rect], state: {selected: selected.has(annotation.id), hovered: false}};
        const appearance = computeStyle(highlight, overrides?.get(annotation.id) || currentStyle);
        style(badge, '--dta-label-color', appearance.fill || '#b9d7ce');
        style(badge, 'max-width', px(Math.max(0, right - left - (inline ? 8 : 0))));
        const badgeBounds = badge.getBoundingClientRect();
        items.push({id: annotation.id, x: rect.x, y: rect.y, height: rect.height,
          start: annotation.target.selector[0].start, end: annotation.target.selector.at(-1).end,
          badgeWidth: Math.ceil(badgeBounds.width), badgeHeight: Math.ceil(badgeBounds.height)});
      }
      for (const [id, badge] of badges) if (!liveIds.has(id)) {
        // Keep focus in the widget if an externally removed annotation owned it.
        if (badge === focused) container.focus({preventScroll: true});
        badge.remove();
        badges.delete(id);
      }
      const nextSlots = inlineLabelSlots(showLabels ? items : [], labelPosition, Math.max(0, right - left));
      const signatureSlots = JSON.stringify(nextSlots);
      if (signatureSlots !== lastSlots) {
        lastSlots = signatureSlots;
        slots.clear();
        const fragment = document.createDocumentFragment();
        for (const part of sourceParts(text, nextSlots)) {
          if (typeof part === 'string') fragment.appendChild(document.createTextNode(part));
          else {
            const slot = document.createElement('span');
            slot.className = 'dta-label-gap';
            slot.setAttribute('aria-hidden', 'true');
            slot.style.width = px(part.width);
            fragment.appendChild(slot);
            slots.set(part.id, slot);
          }
        }
        source.replaceChildren(fragment);
        // Recreate DOM ranges through the public annotation API after splitting
        // text nodes. Local entity values and undo history do not change.
        onSourceChange();
        renderer.redraw(true);
        return;
      }
      const layout = layoutLabels(items, left, right, labelPosition);
      const nextSpace = showLabels && !inline ? layout.space : 0;
      const shift = labelPosition === 'bottom' ? -nextSpace / 2 : nextSpace / 2;
      const nextShift = `${shift}px`;
      if (space !== nextSpace || container.style.getPropertyValue('--dta-label-shift') !== nextShift) {
        space = nextSpace;
        style(container, '--dta-label-space', `${space}px`);
        style(container, '--dta-label-shift', nextShift);
        state.store.recalculatePositions();
        renderer.redraw(true);
        return;
      }
      for (const item of inline ? items : layout.placements) {
        const badge = badges.get(item.id);
        const slot = slots.get(item.id)?.getBoundingClientRect();
        style(badge, 'left', px(inline ? slot.left - frameBounds.left + 4 : item.left + dx));
        style(badge, 'top', px(inline ? slot.top - frameBounds.top + (slot.height - item.badgeHeight) / 2 : item.top + dy));
      }

      const drawings = highlights.flatMap(highlight => {
        const appearance = computeStyle(highlight, overrides?.get(highlight.annotation.id) || currentStyle);
        return highlight.rects.map(rect => ({x: rect.x, y: rect.y, width: rect.width, height: rect.height,
          id: highlight.annotation.id, appearance, selected: highlight.state.selected}));
      });
      const signature = JSON.stringify([dx, dy, drawings]);
      if (signature !== lastHighlights) {
        lastHighlights = signature;
        const fragment = document.createDocumentFragment();
        for (const drawing of drawings) {
          const span = document.createElement('span');
          span.className = 'dta-highlight';
          span.dataset.annotation = drawing.id;
          span.dataset.selected = String(drawing.selected);
          const {appearance} = drawing;
          span.style.cssText = `left:${drawing.x + dx}px;top:${drawing.y + dy}px;width:${drawing.width}px;height:${drawing.height}px;`;
          span.style.setProperty('--dta-label-color', appearance.fill || '#b9d7ce');
          span.style.setProperty('--dta-fill', `${(appearance.fillOpacity ?? .38) * 100}%`);
          span.style.borderBottomColor = appearance.underlineColor || appearance.fill;
          span.style.borderBottomWidth = `${appearance.underlineThickness ?? 1}px`;
          span.style.borderBottomStyle = appearance.underlineStyle || 'solid';
          fragment.appendChild(span);
        }
        highlightsLayer.replaceChildren(fragment);
      }
    }
    function refreshMetrics() {
      if (!destroyed) {
        state.store.recalculatePositions();
        renderer.redraw(true);
      }
    }
    const painter = {
      redraw,
      setVisible(value) {
        visible = value;
        highlightsLayer.hidden = !value;
        labelsLayer.hidden = !value || !getOptions().showLabels;
      },
      destroy() {
        destroyed = true;
        document.fonts?.removeEventListener('loadingdone', refreshMetrics);
        highlightsLayer.remove();
        labelsLayer.remove();
        container.style.removeProperty('--dta-label-space');
        container.style.removeProperty('--dta-label-shift');
        badges.clear();
        slots.clear();
      },
    };
    renderer = createRenderer(painter, container, state, viewport);
    document.fonts?.addEventListener('loadingdone', refreshMetrics);
    return renderer;
  };
}
