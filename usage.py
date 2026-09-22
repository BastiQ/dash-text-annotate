"""Run with `python usage.py`; each browser session owns its saved annotations."""
import base64
import json
from copy import deepcopy

from dash import Dash, Input, Output, State, ctx, dcc, html, no_update
from dash_text_annotate import DashTextAnnotate, validate_entities

DOCUMENTS = {
    'field-notes': {
        'title': 'Field notes',
        'text': '😀 Acme Labs opened a research office in Berlin on 12 May 2026.\n\nMaya Chen leads the team. Acme Labs will share its first findings in June.\n\nTry overlapping labels, or use Find a passage to annotate with the keyboard.',
        'entities': [{'id': 'example-org', 'start': 2, 'end': 11, 'tag': 'ORG'}, {'id': 'example-place', 'start': 40, 'end': 46, 'tag': 'PLACE'}],
    },
    'project-update': {
        'title': 'Project update',
        'text': 'On Monday, Noor met the Acme Labs team in Zürich.\n\nThe next review is on 5 October 2026.\nNotes in any language are welcome: 你好 · مرحبًا · café.',
        'entities': [],
    },
}
COLORS = {'ORG': '#79b9a5', 'PERSON': '#d6a4bf', 'PLACE': '#97b8dc', 'DATE': '#d5b16c'}


def annotation_record(document_id, text, entities):
    return {'format': 'dash-text-annotate/v1', 'document_id': document_id,
            'offset_unit': 'codepoint', 'text': text,
            'entities': validate_entities(text, entities)}


def import_record(contents, document_id, text):
    """Reject stale or malformed uploads before they reach the widget."""
    if len(contents) > 2_000_000:
        raise ValueError('This demo accepts JSON files up to 1 MB.')
    raw = base64.b64decode(contents.split(',', 1)[1], validate=True)
    if len(raw) > 1_000_000:
        raise ValueError('This demo accepts JSON files up to 1 MB.')
    record = json.loads(raw)
    if not isinstance(record, dict) or record.get('format') != 'dash-text-annotate/v1':
        raise ValueError('Use a JSON file exported by this demo.')
    if record.get('text') != text or record.get('document_id') != document_id:
        raise ValueError('The file belongs to a different document. Open that document first.')
    if record.get('offset_unit') != 'codepoint':
        raise ValueError('Convert legacy UTF-16 offsets before importing.')
    if not isinstance(record.get('entities'), list):
        raise ValueError('The file must contain an entities list.')
    return validate_entities(text, record['entities'])


def create_app():
    app = Dash(__name__, title='Dash Text Annotate')

    def layout():
        return html.Main([
            dcc.Store(id='saved', storage_type='session'), dcc.Download(id='download'),
            html.Header([
                html.P('DASH TEXT ANNOTATE', className='eyebrow'),
                html.H1('Text annotation, inside Dash.'),
                html.P('Select a passage, assign a label, and receive Python-ready spans. Your source text stays intact.', className='intro'),
            ]),
            html.Div([
                html.Div([html.Label('Document', htmlFor='document'), dcc.Dropdown(
                    id='document', options=[{'label': value['title'], 'value': key} for key, value in DOCUMENTS.items()],
                    value='field-notes', clearable=False, searchable=False,
                )]),
                html.Div([html.Label('Label for new passages', htmlFor='label'), dcc.Dropdown(
                    id='label', options=[{'label': label, 'value': value} for value, label in [
                        ('ORG', 'Organisation'), ('PERSON', 'Person'), ('PLACE', 'Place'), ('DATE', 'Date')]],
                    value='ORG', clearable=False, searchable=False,
                )]),
                html.Div([
                    dcc.Checklist(id='read-only', options=[{'label': ' Read-only review', 'value': 'yes'}], value=[]),
                    dcc.Checklist(id='inline-labels', options=[{'label': ' Show passage labels', 'value': 'yes'}], value=['yes']),
                ], className='demo-options'),
            ], className='demo-controls'),
            html.P('Save before switching documents. Saved annotations stay in this browser session.', className='hint'),
            DashTextAnnotate(id='annotator', text='', entities=[], document_id='initial', tag='ORG', tag_colors=COLORS),
            html.Div([
                html.Button('Save annotations', id='save', className='primary'),
                html.Button('Reload saved', id='reload'),
                html.Button('Export JSON', id='export'),
                dcc.Upload(id='import', children=html.Button('Import JSON'), accept='.json,application/json', multiple=False),
            ], className='save-controls'),
            html.P(id='save-status', role='status'), html.P(id='load-status', role='status'),
            html.Details([html.Summary('Annotation JSON'), html.Pre(id='output')], className='json-preview'),
            html.Footer([
                'A reusable component for your own Dash workflows. ',
                html.A('Documentation', href='https://github.com/BastiQ/dash-text-annotate#readme'),
                ' · Powered by ', html.A('Recogito', href='https://github.com/recogito/text-annotator-js'),
            ]),
        ], className='demo')

    app.layout = layout

    @app.callback(
        Output('annotator', 'text'), Output('annotator', 'entities'), Output('annotator', 'document_id'), Output('load-status', 'children'),
        Input('document', 'value'), Input('reload', 'n_clicks'), Input('import', 'contents'), State('saved', 'data'),
    )
    def load(document_id, _, upload, saved):
        document = DOCUMENTS[document_id]
        text = document['text']
        try:
            if ctx.triggered_id == 'import' and upload:
                return text, import_record(upload, document_id, text), document_id, 'Imported. Save to keep these annotations in this session.'
            record = (saved or {}).get(document_id)
            if record:
                if record.get('text') != text or record.get('offset_unit') != 'codepoint':
                    raise ValueError('Saved annotations refer to a different version of this document.')
                values = validate_entities(text, record.get('entities'))
            else:
                values = validate_entities(text, deepcopy(document['entities']))
            return text, values, document_id, 'Saved annotations loaded.' if record else 'Example document loaded.'
        except (ValueError, TypeError, KeyError, IndexError, AttributeError) as exception:
            if ctx.triggered_id == 'import':
                return no_update, no_update, no_update, f'Import failed: {exception}'
            return text, validate_entities(text, document['entities']), document_id, f'Saved data could not be loaded: {exception}'

    @app.callback(Output('annotator', 'tag'), Input('label', 'value'))
    def label(value):
        return value

    @app.callback(Output('annotator', 'read_only'), Input('read-only', 'value'))
    def read_only(value):
        return bool(value)

    @app.callback(Output('annotator', 'show_labels'), Input('inline-labels', 'value'))
    def show_labels(value):
        return bool(value)

    @app.callback(Output('output', 'children'), Input('annotator', 'entities'))
    def output(entities):
        return json.dumps(entities or [], ensure_ascii=False, indent=2)

    @app.callback(
        Output('saved', 'data'), Output('save-status', 'children'), Input('save', 'n_clicks'),
        State('annotator', 'document_id'), State('annotator', 'text'), State('annotator', 'entities'), State('saved', 'data'),
        prevent_initial_call=True,
    )
    def save(_, document_id, text, entities, saved):
        try:
            record = annotation_record(document_id, text, entities)
        except ValueError as exception:
            return no_update, f'Could not save: {exception}'
        return {**(saved if isinstance(saved, dict) else {}), document_id: record}, f'Saved {len(record["entities"])} {"annotation" if len(record["entities"]) == 1 else "annotations"} in this browser session.'

    @app.callback(
        Output('download', 'data'), Input('export', 'n_clicks'),
        State('annotator', 'document_id'), State('annotator', 'text'), State('annotator', 'entities'),
        prevent_initial_call=True,
    )
    def export(_, document_id, text, entities):
        record = annotation_record(document_id, text, entities)
        return {'content': json.dumps(record, ensure_ascii=False, indent=2), 'filename': f'{document_id}.json', 'type': 'application/json'}

    return app


app = create_app()
server = app.server
if __name__ == '__main__':
    app.run(debug=True)
