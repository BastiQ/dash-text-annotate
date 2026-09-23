import base64
import json
import pytest
from usage import DOCUMENTS, annotation_record, create_app, import_record
from dash_text_annotate import validate_entities


def encode(record):
    return 'data:application/json;base64,' + base64.b64encode(json.dumps(record).encode()).decode()


def test_demo_fixtures_and_export_import_roundtrip():
    for key, doc in DOCUMENTS.items():
        values = validate_entities(doc['text'], doc['entities'])
        record = annotation_record(key, doc['text'], values)
        assert import_record(encode(record), key, doc['text']) == values
    assert [e['text'] for e in validate_entities(DOCUMENTS['field-notes']['text'], DOCUMENTS['field-notes']['entities'])] == ['Acme Labs', 'Berlin']


def test_import_rejects_wrong_source_units_and_invalid_spans():
    record = annotation_record('x', '😀 Acme', [{'start': 2, 'end': 6, 'tag': 'ORG'}])
    with pytest.raises(ValueError, match='different document'):
        import_record(encode(record), 'x', 'Other text')
    with pytest.raises(ValueError, match='UTF-16'):
        import_record(encode({**record, 'offset_unit': 'utf16'}), 'x', '😀 Acme')
    record['entities'][0]['start'] = None
    with pytest.raises(ValueError, match='offsets'):
        import_record(encode(record), 'x', '😀 Acme')


def test_session_storage_and_no_shared_mutable_layout():
    app = create_app()
    first, second = app.layout(), app.layout()
    assert first is not second
    stores = [child for child in first.children if getattr(child, 'id', None) == 'saved']
    assert len(stores) == 1 and stores[0].storage_type == 'session'
    assert app.server.test_client().get('/').status_code == 200


def test_dash_save_and_export_callbacks_validate_and_return_portable_records():
    app = create_app()
    client = app.server.test_client()
    text = DOCUMENTS['field-notes']['text']
    values = [{'start': 2, 'end': 11, 'tag': 'ORG'}]
    states = [{'id': 'annotator', 'property': prop, 'value': value} for prop, value in [
        ('document_id', 'field-notes'), ('text', text), ('entities', values),
    ]]
    response = client.post('/_dash-update-component', json={
        'output': 'download.data', 'outputs': {'id': 'download', 'property': 'data'},
        'inputs': [{'id': 'export', 'property': 'n_clicks', 'value': 1}],
        'state': states, 'changedPropIds': ['export.n_clicks'],
    })
    assert response.status_code == 200
    exported = response.json['response']['download']['data']
    record = json.loads(exported['content'])
    assert exported['filename'] == 'field-notes.json'
    assert record['offset_unit'] == 'codepoint'
    assert record['entities'][0]['text'] == 'Acme Labs'
    save_key = next(key for key in app.callback_map if key.startswith('..saved.data'))
    request = {
        'output': save_key,
        'outputs': [{'id': 'saved', 'property': 'data'}, {'id': 'save-status', 'property': 'children'}],
        'inputs': [{'id': 'save', 'property': 'n_clicks', 'value': 1}],
        'state': states + [{'id': 'saved', 'property': 'data', 'value': None}],
        'changedPropIds': ['save.n_clicks'],
    }
    response = client.post('/_dash-update-component', json=request)
    assert response.status_code == 200
    assert response.json['response']['saved']['data']['field-notes'] == record
    values[0]['start'] = None
    response = client.post('/_dash-update-component', json=request)
    assert response.status_code == 200
    assert 'saved' not in response.json['response']
    assert 'Could not save' in response.json['response']['save-status']['children']
