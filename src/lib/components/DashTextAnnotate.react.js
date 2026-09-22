import React, {useEffect, useId, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {v4 as uuid} from 'uuid';
import {createTextAnnotator} from '@recogito/text-annotator';
import {createHistory, editHistory, undoHistory, redoHistory, normalizeEntities,
    toRecogito, fromSelection, sameEntities} from '../model.mjs';
import '../styles.css';

/**
 * Annotate immutable text with labelled, potentially overlapping spans.
 * Select text to add the active label, or use the accessible passage search.
 * Public offsets are zero-based Python code points, end exclusive.
 */
export default function DashTextAnnotate(props) {
    const {id, text = '', entities, document_id, tag = 'LABEL', tag_colors = {},
        offset_unit = 'codepoint', read_only = false, show_toolbar = true,
        show_annotations = true, className = '', style, aria_label = 'Text annotation'} = props;
    const uid = useId();
    const container = useRef(null);
    const engine = useRef(null);
    const current = useRef(props);
    current.current = {...props, text, tag, tag_colors, offset_unit, read_only};
    const history = useRef(createHistory([]));
    const previous = useRef(null);
    const [view, setView] = useState(history.current);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);
    const errorRef = useRef(null);
    const [status, setStatus] = useState('Select a passage to annotate it.');
    const [query, setQuery] = useState('');
    const [occurrence, setOccurrence] = useState(0);

    function reportError(message) {
        setError(message);
        if (message !== errorRef.current) {
            errorRef.current = message;
            current.current.setProps?.({error: message});
        }
    }
    function select(id) {
        setSelected(id);
        current.current.setProps?.({selected_id: id});
    }
    function paint(values) {
        const p = current.current;
        engine.current?.setAnnotations(toRecogito(p.text, values, p.offset_unit));
    }
    function publish(next, message) {
        if (current.current.read_only || errorRef.current) return;
        history.current = next;
        setView(next);
        paint(next.present);
        engine.current?.cancelSelected();
        select(null);
        setStatus(message);
        current.current.setProps?.({entities: next.present});
    }
    function add(entity) {
        const values = history.current.present;
        if (values.some(e => e.start === entity.start && e.end === entity.end && e.tag === entity.tag)) {
            paint(values);
            setStatus('This passage already has that label.');
            return;
        }
        publish(editHistory(history.current, [...values, entity]), `Added ${entity.tag}: ${entity.text}`);
    }

    useEffect(() => {
        const element = container.current;
        const annotator = createTextAnnotator(element, {
            renderer: 'SPANS', selectionMode: 'all', allowModifierSelect: false,
            annotatingEnabled: !current.current.read_only,
        });
        engine.current = annotator;
        let active = true;
        const create = annotation => {
            if (!active) return;
            const p = current.current;
            const selection = window.getSelection();
            if (p.read_only || errorRef.current || !selection || selection.isCollapsed ||
                !element.contains(selection.anchorNode) || !element.contains(selection.focusNode)) {
                paint(history.current.present);
                setStatus('Select a passage entirely inside this document.');
                return;
            }
            try {
                add(fromSelection(p.text, annotation, p.tag, p.tag_colors, p.offset_unit));
                selection.removeAllRanges();
            } catch (exception) {
                paint(history.current.present);
                setStatus(exception.message);
            }
        };
        const selectionChanged = annotations => {
            if (!active) return;
            // Remote refreshes can queue stale selection events.
            const annotation = annotations.find(a => history.current.present.some(e => e.id === a.id));
            select(annotation?.id ?? null);
        };
        annotator.on('createAnnotation', create);
        annotator.on('selectionChanged', selectionChanged);
        return () => {
            active = false;
            annotator.off('createAnnotation', create);
            annotator.off('selectionChanged', selectionChanged);
            annotator.destroy();
            engine.current = null;
        };
    }, [text, document_id, offset_unit]);

    useEffect(() => {
        const old = previous.current;
        const switched = old && (old.text !== text || old.document_id !== document_id || old.unit !== offset_unit);
        // A text-only update must not move the previous document's annotations.
        const stale = switched && sameEntities(old.entities, entities);
        previous.current = {text, document_id, unit: offset_unit, entities};
        try {
            const values = normalizeEntities(text, stale ? [] : entities, offset_unit);
            reportError(null);
            if (switched || !sameEntities(values, history.current.present)) {
                history.current = createHistory(values);
                setView(history.current);
                paint(values);
                engine.current?.cancelSelected();
                select(null);
            } else {
                paint(values);
            }
            if (switched) {
                setQuery('');
                setOccurrence(0);
                setStatus(stale ? 'New document loaded. Previous annotations cleared.' : 'Document loaded.');
            }
            if (stale) current.current.setProps?.({entities: []});
        } catch (exception) {
            history.current = createHistory([]);
            setView(history.current);
            paint([]);
            select(null);
            reportError(exception.message);
        }
    }, [text, document_id, offset_unit, entities]);

    useEffect(() => {
        engine.current?.setAnnotatingEnabled(!read_only && !error);
        engine.current?.setStyle((annotation, state) => {
            const value = view.present.find(entity => entity.id === annotation.id);
            const color = value?.color || tag_colors?.[value?.tag] || '#b9d7ce';
            return {fill: color,
                underlineColor: color, underlineThickness: state.selected ? 3 : 1};
        });
    }, [read_only, error, tag_colors, view, text, document_id, offset_unit]);

    const matches = [];
    if (query) {
        let position = text.indexOf(query);
        while (position !== -1) {
            matches.push(position);
            position = text.indexOf(query, position + 1);
        }
    }
    const match = Math.min(occurrence, Math.max(0, matches.length - 1));
    const chosen = view.present.find(entity => entity.id === selected);
    const validTag = typeof tag === 'string' && !!tag.trim();
    function addMatch() {
        if (!matches.length || !validTag) return;
        const start = matches[match];
        try {
            add(fromSelection(text, {id: uuid(), target: {selector: [
                {start, end: start + query.length},
            ]}}, tag, tag_colors, offset_unit));
        } catch (exception) {
            setStatus(exception.message);
        }
    }
    function remove(id) {
        publish(editHistory(history.current, history.current.present.filter(e => e.id !== id)), 'Annotation removed. Undo is available.');
    }
    function relabel() {
        if (!chosen || !validTag) return;
        const values = history.current.present;
        if (values.some(e => e.id !== chosen.id && e.start === chosen.start && e.end === chosen.end && e.tag === tag)) {
            setStatus('This passage already has that label.');
            return;
        }
        publish(editHistory(history.current, values.map(e => {
            if (e.id !== selected) return e;
            const {color, ...rest} = e;
            return {...rest, tag, ...(tag_colors?.[tag] ? {color: tag_colors[tag]} : {})};
        })), `Label changed to ${tag}.`);
    }
    function keyboard(event) {
        if (read_only || error || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            publish(event.shiftKey ? redoHistory(history.current) : undoHistory(history.current), event.shiftKey ? 'Redone.' : 'Undone.');
        }
    }

    const domId = typeof id === 'object' && id !== null
        ? JSON.stringify(id, Object.keys(id).sort()) : id;
    return <section id={domId} className={`dta ${className}`} style={style} aria-label={aria_label} onKeyDown={keyboard}>
        {show_toolbar && <div className="dta-toolbar" role="group" aria-label="Annotation controls">
            <span className="dta-active-label">{read_only ? 'Read-only review' : `Active label: ${tag || 'Choose a label'}`}</span>
            {!read_only && <>
                <button type="button" onClick={() => publish(undoHistory(history.current), 'Undone.')} disabled={!!error || !view.past.length}>Undo</button>
                <button type="button" onClick={() => publish(redoHistory(history.current), 'Redone.')} disabled={!!error || !view.future.length}>Redo</button>
                <button type="button" onClick={relabel} disabled={!!error || !chosen || !validTag || chosen.tag === tag}>Apply label</button>
                <button type="button" onClick={() => remove(selected)} disabled={!!error || !chosen}>Delete selected</button>
            </>}
        </div>}
        {error && <p className="dta-error" role="alert">Annotations could not be loaded: {error}</p>}
        <p id={`${uid}-help`} className="dta-help">{read_only
            ? 'Select a highlight or an annotation below to review it.'
            : 'Select text to add a label. Use Find a passage to annotate with the keyboard.'}</p>
        <div key={JSON.stringify([text, document_id, offset_unit])} ref={container} className="dta-document"
            tabIndex={0} role="region" aria-label="Document text" aria-describedby={`${uid}-help`}>{text}</div>
        {!read_only && show_toolbar && <details className="dta-search">
            <summary>Find a passage</summary>
            <div className="dta-search-controls">
                <label htmlFor={`${uid}-query`}>Exact text</label>
                <input id={`${uid}-query`} value={query} onChange={event => {setQuery(event.target.value); setOccurrence(0);}}
                    onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); addMatch();}}} />
                <span role="status">{query ? (matches.length ? `Match ${match + 1} of ${matches.length}` : 'No matches') : 'Enter a passage from the document'}</span>
                <button type="button" onClick={() => setOccurrence((match + matches.length - 1) % matches.length)} disabled={matches.length < 2}>Previous match</button>
                <button type="button" onClick={() => setOccurrence((match + 1) % matches.length)} disabled={matches.length < 2}>Next match</button>
                <button type="button" onClick={addMatch} disabled={!!error || !matches.length || !validTag}>Add annotation</button>
            </div>
            {matches.length > 0 && <p className="dta-match-preview" aria-label="Match context">
                …{text.slice(Math.max(0, matches[match] - 35), matches[match])}<mark>{query}</mark>{text.slice(matches[match] + query.length, matches[match] + query.length + 35)}…
            </p>}
        </details>}
        {show_annotations && <div className="dta-annotations">
            <p className="dta-count">{view.present.length} {view.present.length === 1 ? 'annotation' : 'annotations'}</p>
            {!view.present.length && <p className="dta-help">{read_only ? 'No annotations to review.' : 'Your labelled passages will appear here.'}</p>}
            <ul aria-label="Annotations">{view.present.map(entity => <li key={entity.id}>
                <button type="button" className="dta-annotation" aria-pressed={selected === entity.id} onClick={() => {
                    engine.current?.setSelected(entity.id);
                    select(entity.id);
                    engine.current?.scrollIntoView(entity.id);
                }}>
                    <span className="dta-tag">{entity.tag}</span>
                    <span className="dta-quote">{entity.text}</span>
                    <span className="dta-offset">{entity.start}–{entity.end}</span>
                </button>
                {!read_only && <button type="button" className="dta-remove" aria-label={`Remove ${entity.tag}: ${entity.text}`} onClick={() => remove(entity.id)}>Remove</button>}
            </li>)}</ul>
        </div>}
        <p className="dta-status" role="status" aria-live="polite" aria-atomic="true">{read_only ? `${view.present.length} ${view.present.length === 1 ? 'annotation' : 'annotations'} available for review.` : status}</p>
    </section>;
}

DashTextAnnotate.propTypes = {
    /** ID used in Dash callbacks. Pattern-matching dictionary IDs are supported. */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /** Immutable plain text. Whitespace and newlines are preserved. */
    text: PropTypes.string.isRequired,
    /** List of {start, end, tag, id?, text?, color?}. End is exclusive. Extra JSON fields are preserved. */
    entities: PropTypes.arrayOf(PropTypes.object),
    /** Active label applied to new selections. Defaults to LABEL. */
    tag: PropTypes.string,
    /** Optional mapping of label names to CSS colors. Per-entity color takes precedence. */
    tag_colors: PropTypes.object,
    /** Document identity. Change together with text and entities when loading another record. */
    document_id: PropTypes.string,
    /** Offset convention: codepoint (Python slicing, default), or utf16 for legacy JavaScript data. */
    offset_unit: PropTypes.oneOf(['codepoint', 'utf16']),
    /** Disable all edits while retaining highlights and annotation review. Defaults to false. */
    read_only: PropTypes.bool,
    /** Show editing controls and accessible passage search. Defaults to true. */
    show_toolbar: PropTypes.bool,
    /** Show the selectable annotation list. Defaults to true. */
    show_annotations: PropTypes.bool,
    /** Extra CSS class on the component root. */
    className: PropTypes.string,
    /** Inline styles on the component root. */
    style: PropTypes.object,
    /** Accessible name for the component region. Defaults to Text annotation. */
    aria_label: PropTypes.string,
    /** Output: selected annotation ID, or null. */
    selected_id: PropTypes.string,
    /** Output: validation error for incoming data, or null. Invalid annotations are not rendered. */
    error: PropTypes.string,
    /** Dash callback bridge. */
    setProps: PropTypes.func,
};
