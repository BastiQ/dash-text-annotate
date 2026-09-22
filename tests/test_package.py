import json
from pathlib import Path
from dash import Dash, html
import dash_text_annotate as dta


def test_component_defaults_and_pattern_id():
    component = dta.DashTextAnnotate(text='Hello', id={'type': 'annotator', 'index': 1})
    payload = component.to_plotly_json()
    assert payload['namespace'] == 'dash_text_annotate'
    assert payload['props']['text'] == 'Hello'
    assert payload['props']['id']['index'] == 1
    assert 'entities' not in payload['props']


def test_dash_serves_all_declared_assets_locally():
    app = Dash(__name__)
    app.layout = html.Div(dta.DashTextAnnotate(text='😀 Acme'))
    client = app.server.test_client()
    page = client.get('/')
    assert page.status_code == 200
    assert b'dash_text_annotate' in page.data
    assert client.get('/_dash-layout').status_code == 200
    for asset in dta._js_dist + dta._css_dist:
        path = asset['relative_package_path']
        response = client.get(f'/_dash-component-suites/dash_text_annotate/{path}')
        assert response.status_code == 200
        assert response.data
        assert 'external_url' not in asset


def test_generated_metadata_matches_public_api():
    root = Path(dta.__file__).parent
    metadata = json.loads((root / 'metadata.json').read_text())
    properties = next(iter(metadata.values()))['props']
    instance = dta.DashTextAnnotate(text='x')
    assert set(instance._prop_names) == set(properties) - {'setProps'}
    assert 'ExampleComponent' not in dta.__all__
    assert (root / 'THIRD_PARTY_NOTICES.md').is_file()
