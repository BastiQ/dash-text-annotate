"""Deterministic integration fixture; also runnable for manual browser checks."""
import json
from dash import Dash, Input, Output, State, ctx, html, no_update
from dash_text_annotate import DashTextAnnotate

TEXT = '😀 Acme works in Berlin.\nAcme returns on Monday.'


def make_app():
    app = Dash(__name__)
    app.layout = html.Main([
        html.H1('Annotation integration fixture', id='outside'),
        html.Div([html.Button(label, id=key) for key, label in [
            ('overlaps', 'Load overlaps'), ('invalid', 'Load invalid'),
            ('clear', 'Clear annotations'), ('new', 'New document'),
            ('annotated', 'Load annotated document'), ('label', 'Use PERSON'),
            ('readonly', 'Toggle read-only'), ('unmount', 'Remove secondary'),
            ('echo', 'Echo reordered fields'),
            ('new-reordered', 'New document with reordered old spans'),
        ]]),
        DashTextAnnotate(id='annotator', text=TEXT, tag='ORG'),
        html.Pre(id='output'), html.Pre(id='error-output'), html.Pre(id='selected-output'),
        html.Div(DashTextAnnotate(id='secondary', text='abcdef', read_only=True, entities=[
            {'start': 1, 'end': 4, 'tag': 'A'}, {'start': 2, 'end': 5, 'tag': 'B'},
        ]), id='secondary-container'),
    ], style={'maxWidth': '880px', 'margin': '32px auto', 'fontFamily': 'system-ui'})

    @app.callback(Output('output', 'children'), Input('annotator', 'entities'))
    def output(entities):
        return json.dumps(entities or [], ensure_ascii=False)

    @app.callback(Output('error-output', 'children'), Input('annotator', 'error'))
    def error(value):
        return value or ''

    @app.callback(Output('selected-output', 'children'), Input('annotator', 'selected_id'))
    def selected(value):
        return value or ''

    @app.callback(
        Output('annotator', 'entities'), Output('annotator', 'text'), Output('annotator', 'document_id'),
        Input('overlaps', 'n_clicks'), Input('invalid', 'n_clicks'), Input('clear', 'n_clicks'),
        Input('new', 'n_clicks'), Input('annotated', 'n_clicks'), Input('echo', 'n_clicks'), Input('new-reordered', 'n_clicks'),
        State('annotator', 'entities'), prevent_initial_call=True,
    )
    def load(*_):
        if ctx.triggered_id == 'new-reordered':
            return json.loads(json.dumps(_[-1], sort_keys=True)), 'A different document.', 'different'
        if ctx.triggered_id == 'echo':
            return json.loads(json.dumps(_[-1], sort_keys=True)), no_update, no_update
        if ctx.triggered_id == 'overlaps':
            return [{'start': 2, 'end': 6, 'tag': 'ORG'}, {'start': 4, 'end': 12, 'tag': 'OTHER'}], TEXT, 'original'
        if ctx.triggered_id == 'invalid':
            return [{'start': None, 'end': 4, 'tag': 'ORG'}], no_update, no_update
        if ctx.triggered_id == 'new':
            return no_update, 'A different document.', 'different'
        if ctx.triggered_id == 'annotated':
            return [{'id': 'loaded', 'start': 0, 'end': 4, 'tag': 'ORG', 'text': 'Beta', 'note': 'retain',
                     'metadata': {'reviewed': True, 'labels': ['a', 'b']}}], 'Beta is ready.', 'beta'
        return [], no_update, no_update

    @app.callback(Output('annotator', 'tag'), Input('label', 'n_clicks'), prevent_initial_call=True)
    def label(_):
        return 'PERSON'

    @app.callback(Output('annotator', 'read_only'), Input('readonly', 'n_clicks'), State('annotator', 'read_only'), prevent_initial_call=True)
    def readonly(_, value):
        return not value

    @app.callback(Output('secondary-container', 'children'), Input('unmount', 'n_clicks'), prevent_initial_call=True)
    def unmount(_):
        return []

    return app


if __name__ == '__main__':
    make_app().run(port=8051, debug=False)
